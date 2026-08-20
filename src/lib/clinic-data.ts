export type Appointment = {
  id: string;
  patient: string;
  doctor: string;
  time: string;
  date: string;
  treatment: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  phone: string;
  lastVisit: string;
  nextVisit: string;
  plan: string;
  balance: number;
  risk: "Low" | "Medium" | "High";
};

export const doctors = [
  { name: "Dr. Sarah Mehta", specialization: "General Dentistry", patients: 128, rating: 4.9 },
  { name: "Dr. Rohan Verma", specialization: "Orthodontics", patients: 94, rating: 4.8 },
  { name: "Dr. Ayesha Khan", specialization: "Periodontics", patients: 76, rating: 4.9 },
];

export const appointments: Appointment[] = [
  { id: "A-1041", patient: "Neha Kulkarni", doctor: "Dr. Sarah Mehta", time: "09:30", date: "Today", treatment: "Scaling & Polishing", status: "Confirmed" },
  { id: "A-1042", patient: "Arjun Rao", doctor: "Dr. Rohan Verma", time: "10:15", date: "Today", treatment: "Braces Adjustment", status: "Confirmed" },
  { id: "A-1043", patient: "Priya Nair", doctor: "Dr. Ayesha Khan", time: "11:00", date: "Today", treatment: "Gum Therapy", status: "Pending" },
  { id: "A-1044", patient: "Imran Shaikh", doctor: "Dr. Sarah Mehta", time: "12:30", date: "Today", treatment: "Root Canal — Session 2", status: "Confirmed" },
  { id: "A-1045", patient: "Meera Joshi", doctor: "Dr. Rohan Verma", time: "15:00", date: "Today", treatment: "Retainer Fitting", status: "Pending" },
  { id: "A-1046", patient: "Kabir Sen", doctor: "Dr. Ayesha Khan", time: "16:45", date: "Tomorrow", treatment: "Implant Review", status: "Completed" },
];

export const patients: Patient[] = [
  { id: "DC-4821", name: "Neha Kulkarni", age: 31, phone: "+91 98200 11223", lastVisit: "12 Jun", nextVisit: "Today", plan: "Preventive Care", balance: 0, risk: "Low" },
  { id: "DC-5133", name: "Arjun Rao", age: 17, phone: "+91 98104 55210", lastVisit: "28 Jun", nextVisit: "Today", plan: "Orthodontic — 14 mo", balance: 18500, risk: "Medium" },
  { id: "DC-2907", name: "Priya Nair", age: 45, phone: "+91 90045 78112", lastVisit: "02 Jul", nextVisit: "Today", plan: "Periodontal Maintenance", balance: 4200, risk: "High" },
  { id: "DC-6614", name: "Imran Shaikh", age: 38, phone: "+91 99887 33420", lastVisit: "09 Jul", nextVisit: "Today", plan: "Endodontic — RCT", balance: 9800, risk: "Medium" },
  { id: "DC-3380", name: "Meera Joshi", age: 26, phone: "+91 93726 90014", lastVisit: "15 Jul", nextVisit: "Today", plan: "Retention Phase", balance: 0, risk: "Low" },
  { id: "DC-7742", name: "Kabir Sen", age: 52, phone: "+91 98450 12678", lastVisit: "18 Jul", nextVisit: "Tomorrow", plan: "Implant Follow-up", balance: 26000, risk: "High" },
];

export const weeklyVisits = [
  { day: "Mon", visits: 18, revenue: 42 },
  { day: "Tue", visits: 24, revenue: 55 },
  { day: "Wed", visits: 21, revenue: 48 },
  { day: "Thu", visits: 29, revenue: 71 },
  { day: "Fri", visits: 26, revenue: 63 },
  { day: "Sat", visits: 33, revenue: 86 },
  { day: "Sun", visits: 11, revenue: 24 },
];

export const treatmentMix = [
  { name: "Preventive", value: 38 },
  { name: "Restorative", value: 26 },
  { name: "Orthodontics", value: 20 },
  { name: "Surgical", value: 16 },
];

export const treatmentPlan = [
  { step: "Diagnostic X-ray & charting", status: "Done", cost: 1200 },
  { step: "Deep cleaning (upper arch)", status: "Done", cost: 3500 },
  { step: "Composite filling — tooth 26", status: "In progress", cost: 4200 },
  { step: "Root canal — tooth 36", status: "Scheduled", cost: 9800 },
  { step: "Zirconia crown placement", status: "Planned", cost: 14500 },
];

/** Upper-right, upper-left, lower-left, lower-right FDI quadrants. */
export const quadrants: { label: string; teeth: number[] }[] = [
  { label: "Upper Right", teeth: [18, 17, 16, 15, 14, 13, 12, 11] },
  { label: "Upper Left", teeth: [21, 22, 23, 24, 25, 26, 27, 28] },
  { label: "Lower Right", teeth: [48, 47, 46, 45, 44, 43, 42, 41] },
  { label: "Lower Left", teeth: [31, 32, 33, 34, 35, 36, 37, 38] },
];

export const toothConditions: Record<number, "healthy" | "treated" | "watch" | "issue"> = {
  16: "treated",
  26: "issue",
  36: "issue",
  17: "watch",
  46: "treated",
  24: "watch",
  11: "healthy",
};

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
