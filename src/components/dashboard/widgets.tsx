import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon, tone = "primary", hint }: { label: string; value: React.ReactNode; icon: LucideIcon; tone?: "primary" | "secondary" | "info" | "accent" | "success"; hint?: string }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/20 text-warning",
    info: "bg-info/10 text-info",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
  };
  return (
    <div className="card-surface flex items-center gap-4 p-5">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}><Icon size={22} /></span>
      <div className="min-w-0">
        <p className="text-sm text-base-content/60">{label}</p>
        <p className="font-display text-2xl font-bold capitalize">{value}</p>
        {hint && <p className="text-xs text-base-content/50">{hint}</p>}
      </div>
    </div>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card-surface space-y-3 p-5">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="skeleton-box h-12" />)}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-box h-[92px]" />)}
    </div>
  );
}
