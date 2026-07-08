import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidV4 } from "@/lib/uuid";
import { supabase } from "@/integrations/supabase/client";
import { processUpload } from "@/lib/processing.functions";
import { AppShell } from "@/components/AppShell";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Loader2, Trash2, Clock, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  fileToBase64,
  urlToBase64,
  dataURLtoFile,
  getHistory,
  saveToHistory,
  deleteFromHistory,
  clearHistory,
  saveActiveState,
  getActiveState,
  clearActiveState,
  HistoryItem,
} from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Workspace — SnapCut AI" },
      { name: "description", content: "Upload an image and get a transparent PNG in seconds." },
    ],
  }),
  component: WorkspacePage,
});

type ResultState = {
  originalUrl: string;
  resultUrl: string;
  filename: string;
};

function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [result, setResult] = useState<ResultState | null>(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const queryClient = useQueryClient();

  // Load state on mount (client-side only to prevent SSR mismatch)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadSavedData = async () => {
        try {
          const historyItems = await getHistory();
          setHistory(historyItems);

          const active = await getActiveState();
          if (active.result) setResult(active.result);
          if (active.originalBase64) {
            setSelectedPreviewUrl(active.originalBase64);
            if (active.filename) {
              try {
                const restoredFile = dataURLtoFile(active.originalBase64, active.filename);
                setSelectedFile(restoredFile);
              } catch (e) {
                console.error("Failed to restore selected file from active state", e);
              }
            }
          }
        } catch (e) {
          console.error("Failed to load local storage state on mount:", e);
        }
      };
      loadSavedData();
    }
  }, []);

  // Sync active editor state to localStorage whenever it changes
  useEffect(() => {
    saveActiveState({
      filename: selectedFile?.name || null,
      originalBase64: selectedPreviewUrl,
      result,
    });
  }, [selectedFile, selectedPreviewUrl, result]);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Not signed in");

      const ext = file.name.split(".").pop() || "bin";
      const uploadId = uuidV4();
      const path = `${userId}/${uploadId}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("uploads")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw new Error(upErr.message);

      const res = await processUpload({
        data: {
          uploadPath: path,
          originalFilename: file.name,
          originalSize: file.size,
          contentType: file.type as "image/jpeg" | "image/png" | "image/webp",
        },
      });
      return { ...res, filename: file.name };
    },
    onSuccess: async (data, file) => {
      console.log("API response:", data);
      console.log("Result URL:", data.resultUrl);

      const rawUrl = data.resultUrl;

      if (!rawUrl) {
        toast.error("No image URL returned from backend");
        return;
      }

      let finalUrl = rawUrl;
      if (finalUrl.startsWith("/")) {
        finalUrl = window.location.origin + finalUrl;
        console.log("Converted relative URL to absolute URL:", finalUrl);
      }

      console.log("Final processed image URL to load:", finalUrl);

      try {
        const originalBase64 = selectedPreviewUrl || (await fileToBase64(file));
        const resultBase64 = await urlToBase64(finalUrl);

        const newResult = {
          originalUrl: originalBase64,
          resultUrl: resultBase64,
          filename: file.name,
        };

        const updatedHistory = await saveToHistory({
          id: data.uploadId || uuidV4(),
          filename: file.name,
          originalBase64,
          resultBase64,
        });

        setHistory(updatedHistory);
        setResult(newResult);
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        toast.success("Background removed!");
      } catch (err) {
        console.error("Failed to convert result image to base64", err);
        // Fallback to storing raw URL
        const originalBase64 = selectedPreviewUrl || "";
        setResult({ originalUrl: originalBase64, resultUrl: finalUrl, filename: file.name });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        toast.success("Background removed!");
      }
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Processing failed");
    },
  });

  useEffect(() => {
    if (!result?.resultUrl) {
      setVerifying(false);
      setVerifyError(null);
      setImageLoaded(false);
      return;
    }

    if (result.resultUrl.startsWith("data:")) {
      setVerifying(false);
      setVerifyError(null);
      setImageLoaded(true);
      return;
    }

    let active = true;
    const verifyUrl = async () => {
      setVerifying(true);
      setVerifyError(null);
      setImageLoaded(false);
      
      console.log("Verifying image URL accessibility via fetch:", result.resultUrl);
      try {
        const response = await fetch(result.resultUrl);
        if (!active) return;

        console.log("Image fetch response status:", response.status);
        if (!response.ok) {
          if ([403, 404, 500].includes(response.status)) {
            console.error(`Image request returned HTTP status code ${response.status}`);
          }
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        console.log("Fetched image Content-Type:", contentType);
        if (!contentType || !contentType.startsWith("image/")) {
          throw new Error(`Invalid content type: expected an image but received "${contentType}"`);
        }

        const supportedTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
        const cleanType = contentType.split(";")[0].trim();
        if (!supportedTypes.includes(cleanType)) {
          throw new Error(`Unsupported image type "${cleanType}". Must be PNG, JPEG, or WebP.`);
        }

        setVerifying(false);
      } catch (err) {
        if (!active) return;
        console.error("Verification failed for image URL:", result.resultUrl, err);
        setVerifyError(err instanceof Error ? err.message : "Failed to load image");
        setVerifying(false);
      }
    };

    verifyUrl();

    return () => {
      active = false;
    };
  }, [result?.resultUrl]);

  const handleFileSelect = async (file: File) => {
    try {
      setSelectedFile(file);
      const base64 = await fileToBase64(file);
      setSelectedPreviewUrl(base64);
    } catch (e) {
      console.error("Failed to convert selected file to base64", e);
      toast.error("Failed to load selected image");
    }
  };

  async function handleDownload() {
    if (!result?.resultUrl) return;

    if (result.resultUrl.startsWith("data:")) {
      handleDownloadHistoryItem(result.filename, result.resultUrl);
      return;
    }

    setDownloading(true);
    console.log("Downloading image from URL:", result.resultUrl);
    try {
      const res = await fetch(result.resultUrl);
      if (!res.ok) throw new Error(`Download failed with status ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = result.filename.replace(/\.[^.]+$/, "") + "-snapcut.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  async function reset() {
    if (selectedPreviewUrl && !selectedPreviewUrl.startsWith("data:")) {
      URL.revokeObjectURL(selectedPreviewUrl);
    }
    setSelectedFile(null);
    setSelectedPreviewUrl(null);
    setResult(null);
    setVerifyError(null);
    setVerifying(false);
    setImageLoaded(false);
    await clearActiveState();
  }

  const handleDeleteHistoryItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = await deleteFromHistory(id);
    setHistory(updated);
    toast.success("Item deleted from history");
  };

  const handleClearHistory = async () => {
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      await clearHistory();
      setHistory([]);
      toast.success("History cleared");
    }
  };

  const handleOpenHistoryItem = (item: HistoryItem) => {
    try {
      const file = dataURLtoFile(item.originalBase64, item.filename);
      setSelectedFile(file);
      setSelectedPreviewUrl(item.originalBase64);
      setResult({
        originalUrl: item.originalBase64,
        resultUrl: item.resultBase64,
        filename: item.filename,
      });
      setActiveTab("editor");
      toast.success(`Loaded ${item.filename} into workspace`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load image from history");
    }
  };

  const handleDownloadHistoryItem = (filename: string, resultBase64: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = document.createElement("a");
    link.href = resultBase64;
    link.download = filename.replace(/\.[^.]+$/, "") + "-snapcut.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drop an image to get a transparent PNG. Max 10 MB, 5000×5000.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="editor">Remove Background</TabsTrigger>
            <TabsTrigger value="history">History ({history.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            {!selectedFile ? (
              <UploadDropzone
                onFile={handleFileSelect}
                busy={mutation.isPending}
                busyLabel="Removing background…"
              />
            ) : !result ? (
              <div className="space-y-6">
                <div className="mx-auto max-w-md">
                  <div className="glass relative rounded-2xl p-3 shadow-glow-violet transition-all duration-300">
                    <div className="mb-2 text-xs font-medium text-muted-foreground">Uploaded Image</div>
                    <div className="checker-bg relative flex aspect-square items-center justify-center overflow-hidden rounded-xl">
                      {selectedPreviewUrl && (
                        <img
                          src={selectedPreviewUrl}
                          alt="uploaded preview"
                          className="max-h-full max-w-full object-contain transition-transform hover:scale-105 duration-300"
                        />
                      )}
                      {mutation.isPending && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm rounded-xl animate-in fade-in duration-300">
                          <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                          <p className="text-sm font-medium">Removing background…</p>
                          <p className="text-xs text-muted-foreground mt-1">This usually takes under 5 seconds.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    onClick={() => mutation.mutate(selectedFile)}
                    disabled={mutation.isPending}
                    className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90 min-w-[180px] transition-all"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Remove Background"
                    )}
                  </Button>
                  <Button variant="outline" onClick={reset} disabled={mutation.isPending}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="glass rounded-2xl p-3">
                    <div className="mb-2 text-xs font-medium text-muted-foreground">Original</div>
                    <div className="checker-bg flex aspect-square items-center justify-center overflow-hidden rounded-xl">
                      {selectedPreviewUrl && (
                        <img src={selectedPreviewUrl} alt="original" className="max-h-full max-w-full object-contain" />
                      )}
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-3 shadow-glow">
                    <div className="mb-2 text-xs font-medium text-muted-foreground">Result</div>
                    <div className="checker-bg relative flex aspect-square items-center justify-center overflow-hidden rounded-xl w-full h-full">
                      {(verifying || (!imageLoaded && !verifyError)) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                          <p className="text-xs font-medium text-muted-foreground">
                            {verifying ? "Verifying image..." : "Loading image..."}
                          </p>
                        </div>
                      )}

                      {verifyError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4 text-center rounded-xl animate-in fade-in duration-200">
                          <span className="text-red-500 font-semibold mb-1 text-sm">Error Loading Image</span>
                          <p className="text-xs text-muted-foreground max-w-xs">{verifyError}</p>
                        </div>
                      )}

                      {result.resultUrl && !verifyError && (
                        <img
                          src={result.resultUrl}
                          alt="result"
                          className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${
                            imageLoaded ? "opacity-100" : "opacity-0"
                          }`}
                          onLoad={() => {
                            console.log("Image tag loaded successfully for URL:", result.resultUrl);
                            setImageLoaded(true);
                          }}
                          onError={(e) => {
                            console.error("Image element failed to load for URL:", result.resultUrl);
                            setVerifyError("Image element failed to render. Please verify backend state.");
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    onClick={handleDownload}
                    disabled={downloading || verifying || !!verifyError}
                    className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90 min-w-[150px]"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="mr-1 h-4 w-4" /> Download PNG
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="mr-1 h-4 w-4" /> Process another
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Saved Images</h2>
                <p className="text-xs text-muted-foreground">
                  Saved locally in your browser. Cleared automatically if storage runs low.
                </p>
              </div>
              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Clear History
                </Button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="glass flex flex-col items-center rounded-2xl p-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">No processed images</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                  Upload and process images to see them saved in your local history tab.
                </p>
                <Button
                  onClick={() => setActiveTab("editor")}
                  className="mt-6 bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90"
                >
                  <Sparkles className="mr-2 h-4 w-4" /> Start Removing Backgrounds
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="glass group relative overflow-hidden rounded-2xl border border-border/50 shadow-sm transition-all duration-300 hover:shadow-glow-violet/20 hover:border-primary/20 flex flex-col"
                  >
                    <div className="checker-bg relative aspect-square flex items-center justify-center overflow-hidden rounded-t-xl bg-muted/20 border-b border-border/50">
                      <img
                        src={item.resultBase64}
                        alt={item.filename}
                        className="max-h-[90%] max-w-[90%] object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-background/70 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-3">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => handleOpenHistoryItem(item)}
                          title="Open in Workspace"
                          className="h-10 w-10 rounded-full shadow-md cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => handleDownloadHistoryItem(item.filename, item.resultBase64, e)}
                          title="Download PNG"
                          className="h-10 w-10 rounded-full shadow-md cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          title="Delete"
                          className="h-10 w-10 rounded-full shadow-md cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-sm text-foreground" title={item.filename}>
                          {item.filename}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.timestamp).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}