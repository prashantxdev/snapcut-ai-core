import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidV4 } from "@/lib/uuid";
import { supabase } from "@/integrations/supabase/client";
import { processUpload } from "@/lib/processing.functions";
import { AppShell } from "@/components/AppShell";
import { UploadDropzone } from "@/components/UploadDropzone";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Download,
  RotateCcw,
  Loader2,
  Trash2,
  Clock,
  Eye,
  Sparkles,
  Search,
  ArrowUpDown,
  Wand2,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
  const userId = user?.id;
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Search & Filter state for History tab
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [result, setResult] = useState<ResultState | null>(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const queryClient = useQueryClient();
  const location = useLocation();

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (val === "history") {
        url.searchParams.set("tab", "history");
      } else {
        url.searchParams.delete("tab");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Handle URL query tab sync on location change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(location.search);
      const tabParam = urlParams.get("tab");
      if (tabParam === "history") {
        setActiveTab("history");
      } else {
        setActiveTab("editor");
      }
    }
  }, [location.search]);

  // Load state on mount / user change
  useEffect(() => {
    if (typeof window !== "undefined" && userId) {
      const loadSavedData = async () => {
        try {
          const historyItems = await getHistory(userId);
          setHistory(historyItems);

          const active = await getActiveState(userId);
          if (active.result) setResult(active.result);
          else setResult(null);

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
          } else {
            setSelectedPreviewUrl(null);
            setSelectedFile(null);
          }
        } catch (e) {
          console.error("Failed to load local storage state on mount:", e);
        }
      };
      loadSavedData();
    } else if (!userId) {
      setHistory([]);
      setResult(null);
      setSelectedPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [userId]);

  // Sync active editor state to storage for current user
  useEffect(() => {
    if (userId) {
      saveActiveState(
        {
          filename: selectedFile?.name || null,
          originalBase64: selectedPreviewUrl,
          result,
        },
        userId
      );
    }
  }, [selectedFile, selectedPreviewUrl, result, userId]);

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
        }, userId);

        setHistory(updatedHistory);
        setResult(newResult);
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        toast.success("Background removed successfully!");
      } catch (err) {
        console.error("Failed to convert result image to base64", err);
        const originalBase64 = selectedPreviewUrl || "";
        setResult({ originalUrl: originalBase64, resultUrl: finalUrl, filename: file.name });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        toast.success("Background removed successfully!");
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

      try {
        const response = await fetch(result.resultUrl);
        if (!active) return;

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
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
      toast.success("Transparent PNG downloaded!");
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
    await clearActiveState(userId);
  }

  const handleDeleteHistoryItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = await deleteFromHistory(id, userId);
    setHistory(updated);
    toast.success("Item deleted from history");
  };

  const handleClearHistory = async () => {
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      await clearHistory(userId);
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
      handleTabChange("editor");
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

  // Filtered & Sorted History List
  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => item.filename.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => (sortOrder === "newest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp));
  }, [history, searchQuery, sortOrder]);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Workspace Title & Tab Navigation Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">AI Background Remover</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Remove image backgrounds in seconds with sub-pixel edge matted transparency.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-8 grid w-full max-w-[420px] grid-cols-2 rounded-2xl bg-card/80 p-1.5 border border-border/60 shadow-inner">
            <TabsTrigger
              value="editor"
              className="rounded-xl py-2 text-xs font-semibold transition-all data-[state=active]:bg-gradient-brand data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
            >
              <Wand2 className="mr-2 h-3.5 w-3.5" /> Remove Background
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-xl py-2 text-xs font-semibold transition-all data-[state=active]:bg-gradient-brand data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
            >
              <Clock className="mr-2 h-3.5 w-3.5" /> History ({history.length})
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: EDITOR / UPLOAD */}
          <TabsContent value="editor" className="space-y-8 animate-in fade-in duration-300">
            {!selectedFile ? (
              <UploadDropzone
                onFile={handleFileSelect}
                busy={mutation.isPending}
                busyLabel="Removing background with AI…"
              />
            ) : !result ? (
              <div className="space-y-8 max-w-2xl mx-auto">
                <div className="glass-card relative rounded-3xl p-4 sm:p-6 shadow-glow-violet border border-border/60 bg-card/60">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Original Image Preview
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                  </div>

                  <div className="checker-bg relative flex aspect-square max-h-[460px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border/40">
                    {selectedPreviewUrl && (
                      <img
                        src={selectedPreviewUrl}
                        alt="uploaded preview"
                        className="max-h-full max-w-full object-contain transition-transform hover:scale-105 duration-300"
                      />
                    )}

                    {/* AI Processing Overlay Banner */}
                    {mutation.isPending && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md rounded-2xl p-6 text-center animate-in fade-in duration-300">
                        <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand-soft text-primary shadow-glow">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                        <h3 className="text-base font-bold text-foreground">AI Processing in Progress</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                          Detecting foreground subjects, hair matted edges, and removing background pixels…
                        </p>

                        {/* Animated Scanning Beam line */}
                        <div className="relative mt-6 w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-brand animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button
                    onClick={() => mutation.mutate(selectedFile)}
                    disabled={mutation.isPending}
                    className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 min-w-[200px] py-6 rounded-2xl font-bold text-sm transition-all"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing AI…
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" /> Remove Background
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={reset}
                    disabled={mutation.isPending}
                    className="rounded-2xl py-6 border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/40 text-sm font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Result Headline Banner */}
                <div className="flex items-center justify-between rounded-2xl bg-primary/10 border border-primary/20 p-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Background Removed Successfully!</h3>
                      <p className="text-xs text-muted-foreground">
                        Drag the center slider below to compare original vs processed HD output.
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex rounded-full bg-secondary/20 border border-secondary/30 px-3 py-1 text-xs font-bold text-secondary">
                    1 Credit Used
                  </span>
                </div>

                {/* Interactive Before/After Comparison Slider */}
                <div className="max-w-4xl mx-auto">
                  <BeforeAfterSlider
                    originalUrl={result.originalUrl}
                    resultUrl={result.resultUrl}
                    className="h-[460px] w-full"
                    onImageLoad={() => setImageLoaded(true)}
                    onImageError={() => setVerifyError("Failed to render processed output")}
                  />
                </div>

                {/* Quick Action Controls */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Button
                    onClick={handleDownload}
                    disabled={downloading || verifying || !!verifyError}
                    className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 min-w-[180px] py-6 rounded-2xl font-bold text-sm transition-all"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" /> Download Transparent PNG
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="rounded-2xl py-6 border-border/60 text-foreground hover:bg-accent/40 text-sm font-semibold"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Remove Another Background
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: HISTORY */}
          <TabsContent value="history" className="space-y-6 animate-in fade-in duration-300">
            {/* Filter & Action Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search history by filename…"
                    className="w-full rounded-2xl border border-input bg-card/60 pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="flex items-center gap-1.5 rounded-2xl border border-input bg-card/60 px-3 py-2 text-xs text-muted-foreground">
                  <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                    className="bg-transparent text-foreground focus:outline-none cursor-pointer text-xs font-semibold"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearHistory}
                  className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-semibold cursor-pointer shrink-0"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear History
                </Button>
              )}
            </div>

            {/* Empty State */}
            {filteredHistory.length === 0 ? (
              <EmptyState
                icon={Clock}
                title={searchQuery ? "No matching history found" : "No Processed Images Yet"}
                description={
                  searchQuery
                    ? `No images in your local history match "${searchQuery}".`
                    : "Upload an image in the studio workspace to start generating transparent HD PNGs."
                }
                actionLabel="Start Removing Backgrounds"
                onAction={() => setActiveTab("editor")}
                actionIcon={Sparkles}
                className="py-16"
              />
            ) : (
              /* Image History Card Grid */
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {filteredHistory.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    className="glass-card group relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 flex flex-col transition-all duration-300"
                  >
                    {/* Image Preview Window */}
                    <div className="checker-bg relative aspect-square w-full flex items-center justify-center overflow-hidden rounded-t-3xl border-b border-border/40 p-4">
                      <img
                        src={item.resultBase64}
                        alt={item.filename}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Tag Badge */}
                      <div className="absolute top-3 left-3 rounded-full bg-background/80 border border-border/50 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground backdrop-blur-md">
                        PNG
                      </div>

                      {/* Hover Overlay Action Controls */}
                      <div className="absolute inset-0 bg-background/80 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-3">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => handleOpenHistoryItem(item)}
                          title="Open in Workspace"
                          className="h-10 w-10 rounded-full shadow-glow cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => handleDownloadHistoryItem(item.filename, item.resultBase64, e)}
                          title="Download PNG"
                          className="h-10 w-10 rounded-full shadow-glow cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          title="Delete"
                          className="h-10 w-10 rounded-full shadow-glow cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Card Footer Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-xs text-foreground" title={item.filename}>
                          {item.filename}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-primary" />
                          {new Date(item.timestamp).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}