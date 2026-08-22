import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Filter, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/clinic/DashboardShell";
import { BookAppointmentDialog } from "@/components/clinic/ClinicDialogs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinic } from "@/lib/clinic-store";
import type { Appointment } from "@/lib/clinic-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Appointments · Dental Club Scheduling" },
      {
        name: "description",
        content:
          "Manage the Dental Club chair schedule — filter by clinician, track confirmations and book new patient appointments.",
      },
      { property: "og:title", content: "Appointments · Dental Club" },
      {
        property: "og:description",
        content: "Chair-side scheduling with clinician filters and live confirmation status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppointmentsPage,
});

const statusTone: Record<string, string> = {
  Confirmed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Completed: "bg-accent text-accent-foreground",
  Cancelled: "bg-destructive/15 text-destructive",
};

const statuses: Appointment["status"][] = ["Pending", "Confirmed", "Completed", "Cancelled"];
const slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

function AppointmentsPage() {
  const { appointments, doctors, updateAppointmentStatus, removeAppointment, notify } = useClinic();
  const [doctorFilter, setDoctorFilter] = useState<string>("All");

  const rows =
    doctorFilter === "All" ? appointments : appointments.filter((a) => a.doctor === doctorFilter);

  const takenSlots = new Set(appointments.filter((a) => a.date === "Today").map((a) => a.time));

  return (
    <DashboardShell
      title="Appointments"
      subtitle={`${appointments.length} bookings across ${doctors.length} clinicians`}
      actions={
        <BookAppointmentDialog
          trigger={
            <Button className="gap-2">
              <Plus className="size-4" /> Book slot
            </Button>
          }
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="surface-panel overflow-hidden xl:col-span-2">
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-4">
            <Filter className="size-4 text-muted-foreground" />
            {["All", ...doctors.map((d) => d.name)].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setDoctorFilter(name)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs transition-colors",
                  doctorFilter === name
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Ref</th>
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Treatment</th>
                  <th className="px-5 py-3 font-medium">When</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-accent/40">
                    <td className="px-5 py-3.5 text-muted-foreground">{a.id}</td>
                    <td className="px-5 py-3.5">
                      <p>{a.patient}</p>
                      <p className="text-xs text-muted-foreground">{a.doctor}</p>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{a.treatment}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-display">{a.time}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{a.date}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Select
                        value={a.status}
                        onValueChange={(v) => {
                          updateAppointmentStatus(a.id, v as Appointment["status"]);
                          toast.success(`${a.id} marked ${v}`);
                        }}
                      >
                        <SelectTrigger
                          className={cn("h-8 w-[8.5rem] border-0 text-xs", statusTone[a.status])}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Cancel ${a.id}`}
                        onClick={() => {
                          removeAppointment(a.id);
                          notify("Appointment removed", `${a.patient} · ${a.time} slot released.`);
                          toast.success(`${a.id} removed from the list`);
                        }}
                      >
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                      No appointments for this clinician.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="surface-panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base">Open slots today</h2>
            <Badge variant="secondary" className="gap-1">
              <Clock className="size-3" /> Chair 3
            </Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {slots.map((s) => {
              const taken = takenSlots.has(s);
              if (taken) {
                return (
                  <button
                    key={s}
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground line-through"
                  >
                    {s}
                  </button>
                );
              }
              return (
                <BookAppointmentDialog
                  key={s}
                  defaultTime={s}
                  trigger={
                    <button
                      type="button"
                      className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/20"
                    >
                      {s}
                    </button>
                  }
                />
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-accent/40 p-4">
            <p className="font-display text-sm">Reminders queued</p>
            <p className="mt-1 text-xs text-muted-foreground">
              12 SMS and 9 email reminders go out at 18:00 for tomorrow's list.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => {
                notify("Reminder queue reviewed", "21 reminders confirmed for 18:00 dispatch.");
                toast.success("Reminder queue reviewed");
              }}
            >
              Review queue
            </Button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
