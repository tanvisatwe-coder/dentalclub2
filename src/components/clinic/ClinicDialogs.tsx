import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useClinic } from "@/lib/clinic-store";

/* ---------------------------------- Book ---------------------------------- */

export function BookAppointmentDialog({
  trigger,
  defaultTime,
}: {
  trigger: ReactNode;
  defaultTime?: string;
}) {
  const { doctors, patients, addAppointment, notify } = useClinic();
  const [open, setOpen] = useState(false);
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState(doctors[0]?.name ?? "");
  const [treatment, setTreatment] = useState("");
  const [time, setTime] = useState(defaultTime ?? "09:30");
  const [date, setDate] = useState("Today");

  const submit = () => {
    if (!patient.trim() || !treatment.trim()) {
      toast.error("Patient name and treatment are required.");
      return;
    }
    const created = addAppointment({
      patient: patient.trim(),
      doctor,
      treatment: treatment.trim(),
      time,
      date,
      status: "Pending",
    });
    notify("Appointment booked", `${created.patient} · ${treatment} at ${time}`);
    toast.success(`Booked ${created.id} for ${created.patient} at ${time}`);
    setOpen(false);
    setPatient("");
    setTreatment("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book an appointment</DialogTitle>
          <DialogDescription>Assign a chair slot to a patient and clinician.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="ap-patient">Patient</Label>
            <Input
              id="ap-patient"
              list="patient-options"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              placeholder="Start typing a name…"
            />
            <datalist id="patient-options">
              {patients.map((p) => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label>Clinician</Label>
            <Select value={doctor} onValueChange={setDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Select clinician" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.name} value={d.name}>
                    {d.name} · {d.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ap-treatment">Treatment</Label>
            <Input
              id="ap-treatment"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="Scaling & polishing"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ap-time">Time</Label>
              <Input
                id="ap-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Day</Label>
              <Select value={date} onValueChange={setDate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="This week">This week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Confirm booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------- Add patient ------------------------------ */

export function AddPatientDialog({ trigger }: { trigger: ReactNode }) {
  const { addPatient, notify } = useClinic();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("30");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("Preventive Care");
  const [risk, setRisk] = useState<"Low" | "Medium" | "High">("Low");

  const submit = () => {
    if (!name.trim()) {
      toast.error("Patient name is required.");
      return;
    }
    const created = addPatient({
      name: name.trim(),
      age: Number(age) || 0,
      phone: phone.trim() || "—",
      lastVisit: "—",
      nextVisit: "Unscheduled",
      plan,
      balance: 0,
      risk,
    });
    notify("Patient registered", `${created.name} added to the roster as ${created.id}.`);
    toast.success(`${created.name} registered · ${created.id}`);
    setOpen(false);
    setName("");
    setPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register a patient</DialogTitle>
          <DialogDescription>Creates a new chart in the clinic roster.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="p-name">Full name</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="p-age">Age</Label>
              <Input id="p-age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-phone">Phone</Label>
              <Input id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Care plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Preventive Care",
                  "Orthodontic — 14 mo",
                  "Periodontal Maintenance",
                  "Endodontic — RCT",
                  "Implant Follow-up",
                ].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Risk band</Label>
            <Select value={risk} onValueChange={(v) => setRisk(v as typeof risk)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Save patient</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------- Add doctor ------------------------------- */

export function AddDoctorDialog({ trigger }: { trigger: ReactNode }) {
  const { addDoctor, notify } = useClinic();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("General Dentistry");

  const submit = () => {
    if (!name.trim()) {
      toast.error("Clinician name is required.");
      return;
    }
    addDoctor({ name: name.trim(), specialization, patients: 0, rating: 5 });
    notify("Clinician added", `${name.trim()} joined the ${specialization} rota.`);
    toast.success(`${name.trim()} added to the rota`);
    setOpen(false);
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a clinician</DialogTitle>
          <DialogDescription>New clinicians appear in scheduling filters.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="d-name">Name</Label>
            <Input
              id="d-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Aditi Rane"
            />
          </div>
          <div className="space-y-2">
            <Label>Specialisation</Label>
            <Select value={specialization} onValueChange={setSpecialization}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "General Dentistry",
                  "Orthodontics",
                  "Periodontics",
                  "Endodontics",
                  "Oral Surgery",
                  "Pedodontics",
                ].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Add clinician</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------- Settings -------------------------------- */

export function SettingsDialog({ trigger }: { trigger: ReactNode }) {
  const { resetDemoData } = useClinic();
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [compact, setCompact] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clinic settings</DialogTitle>
          <DialogDescription>Preferences for this workstation.</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm">Automatic reminders</p>
              <p className="text-xs text-muted-foreground">SMS + email at 18:00 daily</p>
            </div>
            <Switch
              checked={reminders}
              onCheckedChange={(v) => {
                setReminders(v);
                toast.success(v ? "Reminders enabled" : "Reminders paused");
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm">Compact tables</p>
              <p className="text-xs text-muted-foreground">Denser rows for small screens</p>
            </div>
            <Switch
              checked={compact}
              onCheckedChange={(v) => {
                setCompact(v);
                document.documentElement.classList.toggle("compact-tables", v);
              }}
            />
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-sm">Reset demo data</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Restores the seeded patients, appointments and charting.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                resetDemoData();
                toast.success("Demo data restored");
                setOpen(false);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------- Notes ---------------------------------- */

export function ClinicalNoteDialog({ trigger, patient }: { trigger: ReactNode; patient: string }) {
  const { notify } = useClinic();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clinical note</DialogTitle>
          <DialogDescription>Signed against {patient}'s chart.</DialogDescription>
        </DialogHeader>
        <Textarea
          rows={6}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Findings, procedure performed, materials used…"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Discard
          </Button>
          <Button
            onClick={() => {
              if (!note.trim()) {
                toast.error("Write a note first.");
                return;
              }
              notify("Note signed", `New clinical note added to ${patient}'s chart.`);
              toast.success("Clinical note saved");
              setNote("");
              setOpen(false);
            }}
          >
            Sign & save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
