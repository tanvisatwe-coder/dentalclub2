import { createFileRoute, Link } from "@tanstack/react-router";
import { Stethoscope, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · Dental Club Clinic Console" },
      {
        name: "description",
        content:
          "Secure sign in for Dental Club staff and patients — access charts, appointments and treatment plans.",
      },
      { property: "og:title", content: "Sign in · Dental Club" },
      { property: "og:description", content: "Secure access to the Dental Club clinic console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden gradient-hero border-r border-border p-12 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg gradient-primary text-primary-foreground">
            <Stethoscope className="size-5" />
          </span>
          <span className="font-display text-lg">
            Dental<span className="text-gradient">Club</span>
          </span>
        </Link>
        <div className="max-w-md">
          <h1 className="text-4xl leading-tight">One console for the whole practice.</h1>
          <p className="mt-4 text-muted-foreground">
            Charting, scheduling, periodontal records and treatment plans — kept in sync across
            every chair and every clinician.
          </p>
          <p className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-success" /> Role-based access · audit-logged
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Dental Club</p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your workspace.</p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="you@dentalclub.in" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button asChild className="w-full">
              <Link to="/dentist">Sign in as clinician</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/patient">Sign in as patient</Link>
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need an account? Ask your clinic administrator to invite you.
          </p>
        </div>
      </div>
    </div>
  );
}
