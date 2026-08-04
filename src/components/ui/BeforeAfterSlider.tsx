import React, { useState, useRef, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  originalUrl: string;
  resultUrl: string;
  className?: string;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

export function BeforeAfterSlider({
  originalUrl,
  resultUrl,
  className = "",
  onImageLoad,
  onImageError,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl border border-border/60 checker-bg shadow-2xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Result / Background Removed Image (Bottom layer) */}
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <img
          src={resultUrl}
          alt="Processed Result"
          className="max-h-full max-w-full object-contain pointer-events-none"
          onLoad={onImageLoad}
          onError={onImageError}
        />
      </div>

      {/* Original Image (Top clipped layer) */}
      <div
        className="absolute inset-0 overflow-hidden flex items-center justify-center p-2 bg-background/30 backdrop-blur-[1px]"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img
          src={originalUrl}
          alt="Original Image"
          className="max-h-full max-w-full object-contain pointer-events-none"
        />
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 z-10 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground backdrop-blur-md border border-border/50">
        Original
      </div>
      <div className="absolute top-3 right-3 z-10 rounded-full bg-primary/20 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur-md border border-primary/30">
        Removed BG
      </div>

      {/* Slider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 z-20 w-0.5 bg-gradient-brand shadow-glow cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-primary shadow-glow border border-primary/50 backdrop-blur-md transition-transform hover:scale-110 active:scale-95">
          <MoveHorizontal className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
