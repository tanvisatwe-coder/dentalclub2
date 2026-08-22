import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarCheck,
  IndianRupee,
  UserPlus,
  Activity,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell } from "@/components/clinic/DashboardShell";
import { StatCard } from "@/components/clinic/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { treatmentMix, weeklyVisits, formatINR } from "@/lib/clinic-data";
import { useClinic } from "@/lib/clinic-store";
import {
  AddDoctorDialog,
  AddPatientDialog,
  BookAppointmentDialog,
} from "@/components/clinic/ClinicDialogs";

export const Route = createFileRoute("/dentist")({
  head: () => ({
    meta: [
      { title: "Clinic Overview · Dental Club Dashboard" },
      {
        name: "description",
        content:
          "Live clinic overview: today's chair schedule, revenue trend, treatment mix and clinician performance for Dental Club.",
      },
      { property: "og:title", content: "Clinic Overview · Dental Club" },
      {
        property: "og:description",
        content: "Today's schedule, revenue trend and treatment mix in one clinical console.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DentistDashboard,
});

const statusTone: Record<string, string> = {
  Confirmed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Completed: "bg-accent text-accent-foreground",
  Cancelled: "bg-destructive/15 text-destructive",
};

const pieColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

function DentistDashboard() {
  const { appointments, doctors, patients, setActivePatient } = useClinic();
  const navigate = useNavigate();
  const todays = appointments.filter((a) => a.date === "Today");
  const outstanding = patients.reduce((sum, p) => sum + p.balance, 0);
  const utilisation = Math.min(
    100,
    Math.round((todays.filter((a) => a.status !== "Cancelled").length / 30) * 100),
  );

  return (
    <DashboardShell
      title="Clinic Overview"
      subtitle={`${todays.length} appointments today · 5 chairs · ${doctors.length} clinicians on duty`}
      actions={
        <div className="flex gap-2">
          <AddPatientDialog
            trigger={
              <Button variant="outline" className="gap-2">
                <UserPlus className="size-4" /> New patient
              </Button>
            }
          />
          <BookAppointmentDialog
            trigger={
              <Button className="gap-2">
                <Plus className="size-4" /> New appointment
              </Button>
            }
          />
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Appointments today" value={String(todays.length)} delta={12} hint="live schedule" icon={CalendarCheck} />
        <StatCard label="Outstanding balances" value={formatINR(outstanding)} delta={8} hint="across roster" icon={IndianRupee} />
        <StatCard label="Patients on file" value={String(patients.length)} delta={-4} hint="active charts" icon={UserPlus} />
        <StatCard label="Chair utilisation" value={`${utilisation}%`} delta={5} hint="today" icon={Activity} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="surface-panel p-5 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base">Visits & revenue</h2>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
            <Badge variant="secondary">Revenue in ₹ thousands</Badge>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyVisits} margin={{ left: -18, right: 6, top: 6 }}>
                <defs>
                  <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ stroke: "var(--color-border)" }}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#visitsFill)"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-panel p-5">
          <h2 className="text-base">Treatment mix</h2>
          <p className="text-sm text-muted-foreground">Share of procedures this month</p>
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={treatmentMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="none"
                >
                  {treatmentMix.map((entry, i) => (
                    <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {treatmentMix.map((t, i) => (
              <li key={t.name} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: pieColors[i % pieColors.length] }}
                  />
                  {t.name}
                </span>
                <span>{t.value}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="surface-panel overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
            <h2 className="text-base">Today's schedule</h2>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <Link to="/appointment">
                View all <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {todays.slice(0, 5).map((a) => (
              <li
                key={a.id}
                onClick={() => {
                  const match = patients.find((p) => p.name === a.patient);
                  if (match) setActivePatient(match.id);
                  navigate({ to: "/patient" });
                }}
                className="flex cursor-pointer flex-wrap items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accent/40"
              >
                <span className="w-14 font-display text-sm">{a.time}</span>
                <Avatar className="size-9 border border-border">
                  <AvatarFallback className="bg-accent text-[0.7rem]">
                    {a.patient
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{a.patient}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.treatment} · {a.doctor}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs ${statusTone[a.status]}`}>
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-panel p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base">Clinicians on duty</h2>
            <AddDoctorDialog
              trigger={
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  <Plus className="size-4" /> Add
                </Button>
              }
            />
          </div>
          <ul className="mt-4 space-y-4">
            {doctors.map((d) => (
              <li key={d.name} className="flex items-center gap-3">
                <Avatar className="size-10 border border-border">
                  <AvatarFallback className="bg-accent text-xs">
                    {d.name.split(" ")[1]?.[0]}
                    {d.name.split(" ")[2]?.[0] ?? ""}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{d.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{d.specialization}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{d.rating}</p>
                  <p className="text-xs text-muted-foreground">{d.patients} pts</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}
