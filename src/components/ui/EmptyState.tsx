import React from "react";
import { LucideIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon = Sparkles,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`glass-card flex flex-col items-center justify-center rounded-3xl p-10 text-center border border-border/50 ${className}`}
    >
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand-soft text-primary shadow-glow">
        <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse" />
        <Icon className="relative h-8 w-8 text-primary" />
      </div>

      <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-6 bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 transition-all duration-200"
        >
          <ActionIcon className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
