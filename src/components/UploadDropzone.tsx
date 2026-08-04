import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, Loader2, Sparkles, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_BYTES = 10 * 1024 * 1024;

export type DropzoneError = string;

interface UploadDropzoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
  busy?: boolean;
  busyLabel?: string;
}

export function UploadDropzone({ onFile, disabled, busy, busyLabel }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const [error, setError] = useState<DropzoneError | null>(null);

  function validateAndEmit(file: File) {
    setError(null);
    if (!ALLOWED.includes(file.type as (typeof ALLOWED)[number])) {
      setError("Unsupported format. Please use JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File size exceeds 10 MB limit.");
      return;
    }
    onFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setHover(false);
    if (disabled || busy) return;
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndEmit(file);
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !busy) setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={handleDrop}
        onClick={() => !busy && !disabled && inputRef.current?.click()}
        className={cn(
          "glass-card relative flex min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 overflow-hidden group",
          hover
            ? "border-primary bg-primary/5 shadow-glow-cyan scale-[1.01]"
            : "border-border/60 hover:border-primary/40 hover:bg-card/70",
          (busy || disabled) && "cursor-not-allowed opacity-75"
        )}
      >
        {/* Glow ambient background element */}
        <div className="absolute -inset-10 bg-gradient-brand opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl pointer-events-none" />

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED.join(",")}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) validateAndEmit(f);
            e.target.value = "";
          }}
        />

        {busy ? (
          <div className="flex flex-col items-center space-y-4 py-4 animate-in fade-in duration-300">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-brand-soft text-primary shadow-glow">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{busyLabel ?? "Processing Image..."}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                AI neural network is detecting subjects & building transparent alpha matting…
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-5 relative z-10">
            <motion.div
              animate={{ y: hover ? -6 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-brand text-primary-foreground shadow-glow group-hover:scale-105 transition-transform duration-300"
            >
              <UploadCloud className="h-10 w-10" />
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </motion.div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Drag and drop your image here
              </h3>
              <p className="text-sm text-muted-foreground">
                or click below to <span className="text-primary font-semibold underline decoration-primary/40 underline-offset-4">Browse Files</span>
              </p>
            </div>

            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!busy && !disabled) inputRef.current?.click();
              }}
              className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 text-xs font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              <ImageIcon className="mr-2 h-4 w-4" /> Select Image
            </Button>

            {/* Supported Formats Pill Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                JPG
              </span>
              <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                PNG
              </span>
              <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                WEBP
              </span>
              <span className="text-[11px] text-muted-foreground font-medium pl-1">
                Max 10 MB (up to 5000×5000)
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-medium animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}