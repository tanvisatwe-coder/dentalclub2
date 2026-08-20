import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Bell,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const nav = [
  { to: "/dentist", label: "Clinic Overview", icon: LayoutDashboard },
  { to: "/appointment", label: "Appointments", icon: CalendarDays },
  { to: "/patient", label: "Patient Record", icon: Users },
];

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Link to="/" className="flex items-center gap-3 px-6 py-6">
          <span className="grid size-9 place-items-center rounded-lg gradient-primary text-primary-foreground">
            <Stethoscope className="size-5" />
          </span>
          <span className="font-display text-lg leading-none text-sidebar-foreground">
            Dental<span className="text-gradient">Club</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1 px-3">
          <p className="px-3 pb-2 pt-4 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Clinic
          </p>
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--sidebar-primary)]"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-4">
          <p className="font-display text-sm">Chair utilisation</p>
          <p className="mt-1 text-xs text-muted-foreground">4 of 5 chairs busy right now</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-4/5 rounded-full gradient-primary" />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-sidebar-border p-3">
          <Button variant="ghost" size="sm" className="flex-1 justify-start gap-2 text-muted-foreground">
            <Settings className="size-4" /> Settings
          </Button>
          <Button asChild variant="ghost" size="icon" className="text-muted-foreground">
            <Link to="/login" aria-label="Sign out">
              <LogOut className="size-4" />
            </Link>
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex flex-wrap items-center gap-4 px-5 py-4 sm:px-8">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl sm:text-2xl">{title}</h1>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search patients, IDs…" className="w-64 pl-9" />
            </div>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-warning" />
            </Button>
            {actions}
            <Avatar className="size-9 border border-border">
              <AvatarFallback className="bg-accent text-xs">SM</AvatarFallback>
            </Avatar>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-5 pb-3 sm:px-8 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs",
                  pathname === item.to
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
