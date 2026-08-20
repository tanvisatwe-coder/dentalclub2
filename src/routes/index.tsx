import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Stethoscope,
  CalendarDays,
  Activity,
  ShieldCheck,
  LineChart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/clinic-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dental Club — Practice Console for Modern Clinics" },
      {
        name: "description",
        content:
          "Dental Club unifies odontogram charting, chair scheduling, treatment plans and billing into one calm, professional clinic console.",
      },
      { property: "og:title", content: "Dental Club — Practice Console for Modern Clinics" },
      {
        property: "og:description",
        content: "Charting, scheduling, treatment plans and billing in one clinic console.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Activity,
    title: "Odontogram charting",
    body: "FDI-notated tooth-by-tooth records with periodontal depths and history on every surface.",
  },
  {
    icon: CalendarDays,
    title: "Chair-aware scheduling",
    body: "See every chair, clinician and open slot on one board, with automated patient reminders.",
  },
  {
    icon: LineChart,
    title: "Practice analytics",
    body: "Revenue, treatment mix and utilisation tracked daily — no spreadsheets, no guesswork.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg gradient-primary text-primary-foreground">
            <Stethoscope className="size-5" />
          </span>
          <span className="font-display text-lg">
            Dental<span className="text-gradient">Club</span>
          </span>
        </span>
        <Button asChild variant="ghost" size="sm">
          <Link to="/login">Sign in</Link>
        </Button>
      </header>

      <section className="gradient-hero border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-primary-glow" /> Built for multi-chair practices
            </span>
            <h1 className="mt-6 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
              The clinical record your practice actually enjoys using.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Dental Club brings charting, scheduling, treatment planning and billing into a single
              quiet interface — so clinicians look at patients, not paperwork.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/dentist">Open clinic console</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/patient">View patient record</Link>
              </Button>
            </div>
            <p className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-success" /> Role-based access, audit-logged
              records
            </p>
          </div>

          <div className="surface-panel overflow-hidden p-2">
            <img
              src={heroImage}
              alt="Modern dental operatory lit in deep indigo at night"
              width={1600}
              height={1104}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="max-w-lg text-3xl">Everything a chair-side team reaches for</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="surface-panel hover-lift p-6">
              <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="surface-panel flex flex-wrap items-center justify-between gap-6 p-10">
          <div>
            <h2 className="text-2xl">Ready to see it with your own list?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore the console with sample clinic data — no setup required.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/appointment">Explore scheduling</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © 2026 Dental Club · Clinic management console
      </footer>
    </div>
  );
}
