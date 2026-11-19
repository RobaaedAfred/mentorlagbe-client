import Logo from "./Logo";
import { BadgeCheck, CalendarCheck, Wallet } from "lucide-react";

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-neutral p-12 text-neutral-content lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        <Logo light />
        <div className="relative space-y-8">
          <h2 className="font-display text-4xl font-bold leading-tight text-white">Learning that fits your goals, schedule and budget.</h2>
          <ul className="space-y-4 text-sm text-neutral-content/80">
            <li className="flex items-center gap-3"><BadgeCheck className="text-secondary" size={20} /> Admin-verified tutors and batches</li>
            <li className="flex items-center gap-3"><CalendarCheck className="text-secondary" size={20} /> Apply in a minute, track status live</li>
            <li className="flex items-center gap-3"><Wallet className="text-secondary" size={20} /> Clear monthly fees, no hidden costs</li>
          </ul>
        </div>
        <p className="relative text-xs text-neutral-content/50">© MentorLagbe</p>
      </aside>
      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mb-8 mt-2 text-base-content/60">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}