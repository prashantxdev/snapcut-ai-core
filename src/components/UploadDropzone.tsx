import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
      setError("Unsupported format. Use JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File too large. Max 10 MB.");
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
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !busy) setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={handleDrop}
        onClick={() => !busy && !disabled && inputRef.current?.click()}
        className={cn(
          "glass relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-10 text-center transition-all",
          hover && "border-primary shadow-glow",
          (busy || disabled) && "cursor-not-allowed opacity-70",
        )}
      >
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
          <>
            <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium">{busyLabel ?? "Processing…"}</p>
            <p className="mt-1 text-xs text-muted-foreground">This usually takes under 5 seconds.</p>
          </>
        ) : (
          <>
            <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
              <UploadCloud className="h-7 w-7" />
            </div>
            <p className="text-base font-semibold">Drop your image here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              or <span className="text-primary">browse</span> — JPG, PNG, WEBP up to 10 MB
            </p>
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}