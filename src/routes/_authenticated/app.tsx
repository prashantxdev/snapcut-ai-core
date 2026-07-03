import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { v4 as uuidV4 } from "@/lib/uuid";
import { supabase } from "@/integrations/supabase/client";
import { processUpload } from "@/lib/processing.functions";
import { AppShell } from "@/components/AppShell";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [result, setResult] = useState<ResultState | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const process = useServerFn(processUpload);
  const queryClient = useQueryClient();

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

      const res = await process({
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

      setResult({ originalUrl: selectedPreviewUrl || "", resultUrl: finalUrl, filename: file.name });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Background removed!");
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

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setSelectedPreviewUrl(url);
  };

  async function handleDownload() {
    if (!result?.resultUrl) return;
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

  function reset() {
    if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl);
    setSelectedFile(null);
    setSelectedPreviewUrl(null);
    setResult(null);
    setVerifyError(null);
    setVerifying(false);
    setImageLoaded(false);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drop an image to get a transparent PNG. Max 10 MB, 5000×5000.
          </p>
        </div>

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
      </div>
    </AppShell>
  );
}