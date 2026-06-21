import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { v4 as uuidV4 } from "@/lib/uuid";
import { supabase } from "@/integrations/supabase/client";
import { processUpload } from "@/lib/processing.functions";
import { AppShell } from "@/components/AppShell";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw } from "lucide-react";
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
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
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
    onSuccess: async (res, file) => {
      const objUrl = URL.createObjectURL(file);
      setOriginalPreview(objUrl);
      setResult({ originalUrl: objUrl, resultUrl: res.resultUrl, filename: file.name });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Background removed!");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Processing failed");
    },
  });

  function reset() {
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    setOriginalPreview(null);
    setResult(null);
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

        {!result ? (
          <UploadDropzone
            onFile={(f) => mutation.mutate(f)}
            busy={mutation.isPending}
            busyLabel="Removing background…"
          />
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass rounded-2xl p-3">
                <div className="mb-2 text-xs font-medium text-muted-foreground">Original</div>
                <div className="checker-bg flex aspect-square items-center justify-center overflow-hidden rounded-xl">
                  {originalPreview && (
                    <img src={originalPreview} alt="original" className="max-h-full max-w-full object-contain" />
                  )}
                </div>
              </div>
              <div className="glass rounded-2xl p-3 shadow-glow">
                <div className="mb-2 text-xs font-medium text-muted-foreground">Result</div>
                <div className="checker-bg flex aspect-square items-center justify-center overflow-hidden rounded-xl">
                  <img src={result.resultUrl} alt="result" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90">
                <a href={result.resultUrl} download={result.filename.replace(/\.[^.]+$/, "") + "-snapcut.png"}>
                  <Download className="mr-1 h-4 w-4" /> Download PNG
                </a>
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