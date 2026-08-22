import { toast } from "sonner";
import { quadrants } from "@/lib/clinic-data";
import { useClinic } from "@/lib/clinic-store";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  healthy: "border-border bg-secondary text-secondary-foreground",
  treated: "border-chart-2/50 bg-chart-2/20 text-chart-2",
  watch: "border-warning/50 bg-warning/20 text-warning",
  issue: "border-destructive/50 bg-destructive/20 text-destructive",
};

const legend = [
  { key: "healthy", label: "Healthy" },
  { key: "treated", label: "Treated" },
  { key: "watch", label: "Monitor" },
  { key: "issue", label: "Needs care" },
];

export function ToothChart() {
  const { teeth, cycleTooth } = useClinic();

  return (
    <div className="surface-panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base">Odontogram</h2>
          <p className="text-sm text-muted-foreground">
            FDI notation · click a tooth to change its condition
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {legend.map((l) => (
            <span key={l.key} className="inline-flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-full border", styles[l.key])} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {quadrants.map((q) => (
          <div key={q.label}>
            <p className="mb-2 text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
              {q.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {q.teeth.map((t) => {
                const condition = teeth[t] ?? "healthy";
                return (
                  <button
                    key={t}
                    type="button"
                    title={`Tooth ${t} — ${condition}`}
                    onClick={() => {
                      cycleTooth(t);
                      toast.success(`Tooth ${t} charting updated`);
                    }}
                    className={cn(
                      "size-9 rounded-md border text-xs font-medium transition-transform hover:scale-110",
                      styles[condition],
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
