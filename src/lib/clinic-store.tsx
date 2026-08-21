import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  appointments as seedAppointments,
  doctors as seedDoctors,
  patients as seedPatients,
  toothConditions as seedTeeth,
  treatmentPlan as seedPlan,
  type Appointment,
  type Doctor,
  type Patient,
  type PlanStep,
  type ToothCondition,
} from "@/lib/clinic-data";

export type ClinicNotification = {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
};

type ClinicState = {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  teeth: Record<number, ToothCondition>;
  plan: PlanStep[];
  notifications: ClinicNotification[];
  activePatientId: string;
};

const STORAGE_KEY = "dental-club-state-v1";

const initialState: ClinicState = {
  appointments: seedAppointments,
  patients: seedPatients,
  doctors: seedDoctors,
  teeth: seedTeeth,
  plan: seedPlan,
  activePatientId: seedPatients[2]!.id,
  notifications: [
    {
      id: "n1",
      title: "Lab work ready",
      body: "Zirconia crown for Kabir Sen has arrived from the lab.",
      at: "08:40",
      read: false,
    },
    {
      id: "n2",
      title: "Payment received",
      body: "₹4,200 settled by Priya Nair against periodontal maintenance.",
      at: "09:12",
      read: false,
    },
    {
      id: "n3",
      title: "Reminder queue",
      body: "21 reminders scheduled to go out at 18:00.",
      at: "09:30",
      read: true,
    },
  ],
};

type ClinicContextValue = ClinicState & {
  search: string;
  setSearch: (v: string) => void;
  activePatient: Patient;
  setActivePatient: (id: string) => void;
  addAppointment: (a: Omit<Appointment, "id">) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  removeAppointment: (id: string) => void;
  addPatient: (p: Omit<Patient, "id">) => Patient;
  addDoctor: (d: Doctor) => void;
  cycleTooth: (tooth: number) => void;
  advancePlanStep: (index: number) => void;
  addPlanStep: (step: PlanStep) => void;
  notify: (title: string, body: string) => void;
  markNotificationsRead: () => void;
  resetDemoData: () => void;
};

const ClinicContext = createContext<ClinicContextValue | null>(null);

const conditionCycle: ToothCondition[] = ["healthy", "watch", "issue", "treated"];

const nowLabel = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ClinicState>(initialState);
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as ClinicState) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const notify = useCallback((title: string, body: string) => {
    setState((s) => ({
      ...s,
      notifications: [
        { id: `n-${Date.now()}`, title, body, at: nowLabel(), read: false },
        ...s.notifications,
      ].slice(0, 20),
    }));
  }, []);

  const value = useMemo<ClinicContextValue>(() => {
    const activePatient =
      state.patients.find((p) => p.id === state.activePatientId) ?? state.patients[0]!;

    return {
      ...state,
      search,
      setSearch,
      activePatient,
      setActivePatient: (id) => setState((s) => ({ ...s, activePatientId: id })),
      addAppointment: (a) => {
        const created: Appointment = {
          ...a,
          id: `A-${1000 + Math.floor(Math.random() * 8999)}`,
        };
        setState((s) => ({ ...s, appointments: [created, ...s.appointments] }));
        return created;
      },
      updateAppointmentStatus: (id, status) =>
        setState((s) => ({
          ...s,
          appointments: s.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
        })),
      removeAppointment: (id) =>
        setState((s) => ({ ...s, appointments: s.appointments.filter((a) => a.id !== id) })),
      addPatient: (p) => {
        const created: Patient = {
          ...p,
          id: `DC-${1000 + Math.floor(Math.random() * 8999)}`,
        };
        setState((s) => ({ ...s, patients: [created, ...s.patients] }));
        return created;
      },
      addDoctor: (d) => setState((s) => ({ ...s, doctors: [...s.doctors, d] })),
      cycleTooth: (tooth) =>
        setState((s) => {
          const current = s.teeth[tooth] ?? "healthy";
          const next = conditionCycle[(conditionCycle.indexOf(current) + 1) % conditionCycle.length]!;
          return { ...s, teeth: { ...s.teeth, [tooth]: next } };
        }),
      advancePlanStep: (index) =>
        setState((s) => {
          const order: PlanStep["status"][] = ["Planned", "Scheduled", "In progress", "Done"];
          return {
            ...s,
            plan: s.plan.map((step, i) =>
              i === index
                ? {
                    ...step,
                    status: order[Math.min(order.indexOf(step.status) + 1, order.length - 1)]!,
                  }
                : step,
            ),
          };
        }),
      addPlanStep: (step) => setState((s) => ({ ...s, plan: [...s.plan, step] })),
      notify,
      markNotificationsRead: () =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      resetDemoData: () => setState(initialState),
    };
  }, [state, search, notify]);

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error("useClinic must be used inside <ClinicProvider>");
  return ctx;
}
