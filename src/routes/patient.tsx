import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, FileText, HeartPulse, Wallet, Download } from "lucide-react";
import { DashboardShell } from "@/components/clinic/DashboardShell";
import { StatCard } from "@/components/clinic/StatCard";
import { ToothChart } from "@/components/clinic/ToothChart";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatINR, patients, treatmentPlan } from "@/lib/clinic-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patient")({
  head: () => ({
    meta: [
      { title: "Patient Record · Dental Club" },
      {
        name: "description",
        content:
          "Full patient record at Dental Club — odontogram charting, staged treatment plan, balances and visit history.",
      },
      { property: "og:title", content: "Patient Record · Dental Club" },
      {
        property: "og:description",
        content: "Odontogram, treatment plan progress and billing for each Dental Club patient.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PatientPage,
});

const planTone: Record<string, string> = {
  Done: "bg-success/15 text-success",
  "In progress": "bg-primary/20 text-primary-glow",
  Scheduled: "bg-warning/15 text-warning",
  Planned: "bg-secondary text-muted-foreground",
};

const riskTone: Record<string, string> = {
  Low: "bg-success/15 text-success",
  Medium: "bg-warning/15 text-warning",
  High: "bg-destructive/15 text-destructive",
};

function PatientPage() {
  const patient = patients[2]!;
  const done = treatmentPlan.filter((p) => p.status === "Done").length;
  const progress = Math.round((done / treatmentPlan.length) * 100);
  const total = treatmentPlan.reduce((sum, p) => sum + p.cost, 0);

  return (
    <DashboardShell
      title={patient.name}
      subtitle={`${patient.id} · ${patient.age} yrs · ${patient.plan}`}
      actions={
        <Button variant="outline" className="gap-2">
          <Download className="size-4" /> Export chart
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Next visit" value="Today 11:00" hint="Gum therapy" icon={CalendarClock} />
        <StatCard label="Plan progress" value={`${progress}%`} delta={20} hint="2 of 5 steps" icon={HeartPulse} />
        <StatCard label="Outstanding" value={formatINR(patient.balance)} hint="due in 7 days" icon={Wallet} />
        <StatCard label="Records on file" value="14" hint="x-rays & notes" icon={FileText} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ToothChart />
        </div>

        <section className="surface-panel p-5">
          <h2 className="text-base">Treatment plan</h2>
          <p className="text-sm text-muted-foreground">Estimated total {formatINR(total)}</p>
          <Progress value={progress} className="mt-4" />
          <ol className="mt-5 space-y-4">
            {treatmentPlan.map((step, i) => (
              <li key={step.step} className="flex gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-border text-xs text-muted-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{step.step}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs", planTone[step.status])}>
                      {step.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatINR(step.cost)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="surface-panel mt-6 overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base">Patient roster</h2>
          <p className="text-sm text-muted-foreground">Recently active records</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Last visit</th>
                <th className="px-5 py-3 font-medium">Next</th>
                <th className="px-5 py-3 font-medium">Balance</th>
                <th className="px-5 py-3 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {patients.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-accent/40">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 border border-border">
                        <AvatarFallback className="bg-accent text-[0.7rem]">
                          {p.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.id} · {p.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{p.plan}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{p.lastVisit}</td>
                  <td className="px-5 py-3.5">{p.nextVisit}</td>
                  <td className="px-5 py-3.5">{p.balance ? formatINR(p.balance) : "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs", riskTone[p.risk])}>
                      {p.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
