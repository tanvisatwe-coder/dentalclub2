import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Bell,
  Search,
  Settings,
  LogOut,
  Menu,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClinic } from "@/lib/clinic-store";
import { AddPatientDialog, SettingsDialog } from "@/components/clinic/ClinicDialogs";

const nav = [
  { to: "/dentist", label: "Clinic Overview", icon: LayoutDashboard },
  { to: "/appointment", label: "Appointments", icon: CalendarDays },
  { to: "/patient", label: "Patient Record", icon: Users },
] as const;

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
  const navigate = useNavigate();
  const {
    patients,
    appointments,
    notifications,
    markNotificationsRead,
    setActivePatient,
  } = useClinic();

  const [query, setQuery] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const results = query.trim()
    ? patients
        .filter((p) =>
          `${p.name} ${p.id} ${p.phone} ${p.plan}`.toLowerCase().includes(query.trim().toLowerCase()),
        )
        .slice(0, 6)
    : [];

  const busyChairs = Math.min(5, appointments.filter((a) => a.status === "Confirmed").length);

  const sidebar = (
    <>
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
              onClick={() => setMobileNav(false)}
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

        <p className="px-3 pb-2 pt-5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Quick actions
        </p>
        <AddPatientDialog
          trigger={
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            >
              <UserPlus className="size-4" /> Register patient
            </button>
          }
        />
      </nav>

      <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-4">
        <p className="font-display text-sm">Chair utilisation</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {busyChairs} of 5 chairs busy right now
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full gradient-primary transition-all"
            style={{ width: `${(busyChairs / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-sidebar-border p-3">
        <SettingsDialog
          trigger={
            <Button variant="ghost" size="sm" className="flex-1 justify-start gap-2 text-muted-foreground">
              <Settings className="size-4" /> Settings
            </Button>
          }
        />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sign out"
          className="text-muted-foreground"
          onClick={() => {
            toast.success("Signed out");
            navigate({ to: "/login" });
          }}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        {sidebar}
      </aside>

      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileNav(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              className="absolute right-2 top-2"
              onClick={() => setMobileNav(false)}
            >
              <X className="size-4" />
            </Button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="lg:hidden"
              onClick={() => setMobileNav(true)}
            >
              <Menu className="size-4" />
            </Button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl sm:text-2xl">{title}</h1>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search patients, IDs…"
                className="w-64 pl-9"
              />
              {results.length > 0 && (
                <ul className="absolute right-0 top-12 z-30 w-72 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-accent"
                        onClick={() => {
                          setActivePatient(p.id);
                          setQuery("");
                          navigate({ to: "/patient" });
                        }}
                      >
                        <span className="truncate">{p.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{p.id}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Popover onOpenChange={(o) => o && markNotificationsRead()}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="size-4" />
                  {unread > 0 && (
                    <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-warning px-1 text-[0.6rem] font-medium text-background">
                      {unread}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <p className="border-b border-border px-4 py-3 text-sm">Notifications</p>
                <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                  {notifications.length === 0 && (
                    <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Nothing new.
                    </li>
                  )}
                  {notifications.map((n) => (
                    <li key={n.id} className="px-4 py-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm">{n.title}</p>
                        <span className="shrink-0 text-xs text-muted-foreground">{n.at}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>

            {actions}

            <Popover>
              <PopoverTrigger asChild>
                <button type="button" aria-label="Account menu">
                  <Avatar className="size-9 border border-border">
                    <AvatarFallback className="bg-accent text-xs">SM</AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56">
                <p className="text-sm">Dr. Sarah Mehta</p>
                <p className="text-xs text-muted-foreground">General Dentistry · Admin</p>
                <div className="mt-3 grid gap-1">
                  <SettingsDialog
                    trigger={
                      <Button variant="ghost" size="sm" className="justify-start gap-2">
                        <Settings className="size-4" /> Settings
                      </Button>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2"
                    onClick={() => {
                      toast.success("Signed out");
                      navigate({ to: "/login" });
                    }}
                  >
                    <LogOut className="size-4" /> Sign out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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
