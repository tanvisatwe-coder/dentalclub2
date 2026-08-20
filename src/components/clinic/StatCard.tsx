import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon: LucideIcon;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="surface-panel hover-lift p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 font-display text-3xl leading-none">{value}</p>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
              positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
            )}
          >
            {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
