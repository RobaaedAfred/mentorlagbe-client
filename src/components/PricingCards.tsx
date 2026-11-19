"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Crown, X } from "lucide-react";
import { useAuth } from "./providers/AuthProvider";
import { api, errorMessage } from "@/lib/api";
import type { Role } from "@/lib/types";

type PlanRole = "tutor" | "student";

const plans: Record<PlanRole, { free: string[]; freeMissing: string[]; pro: string[]; price: number; proName: string }> = {
  tutor: {
    price: 15,
    proName: "Pro Tutor",
    free: ["Post up to 2 tuitions", "Manage applicants", "Public tutor profile"],
    freeMissing: ["Unlimited tuition posts", "Verified badge"],
    pro: ["Unlimited tuition posts", "Verified tutor badge", "Manage applicants", "Public tutor profile"],
  },
  student: {
    price: 10,
    proName: "Pro Student",
    free: ["Browse & apply to tuitions", "Track applications", "Save favourite tuitions"],
    freeMissing: ["Priority booking"],
    pro: ["Priority booking with tutors", "Browse & apply to tuitions", "Track applications", "Save favourite tuitions"],
  },
};

export default function PricingCards() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<PlanRole>("tutor");
  const [busy, setBusy] = useState(false);
  const p = plans[tab];

  const isPro = user?.plan === "pro";
  const matchesRole = user && (user.role as Role) === tab;

  const subscribe = async () => {
    setBusy(true);
    try {
      const { url } = await api<{ url: string }>("/payments/checkout", { method: "POST", auth: true });
      window.location.href = url;
    } catch (e) {
      toast.error(errorMessage(e));
      setBusy(false);
    }
  };

  const cta = () => {
    if (loading) return <button className="btn btn-primary w-full" disabled>Loading...</button>;
    if (!user)
      return <Link href={`/sign-in?redirect=/pricing`} className="btn btn-secondary w-full">Subscribe with Stripe</Link>;
    if (user.role === "admin") return <button className="btn w-full" disabled>Admins don&apos;t need a plan</button>;
    if (!matchesRole) return <button className="btn w-full" disabled>This plan is for {tab}s</button>;
    if (isPro) return <button className="btn btn-success w-full" disabled><Check size={16} /> You&apos;re on Pro</button>;
    return (
      <button onClick={subscribe} className="btn btn-secondary w-full" disabled={busy}>
        {busy && <span className="loading loading-spinner loading-sm" />} Subscribe with Stripe
      </button>
    );
  };

  return (
    <div>
      <div className="mx-auto mb-10 flex w-fit rounded-full border border-base-300 bg-base-100 p-1">
        {(["tutor", "student"] as PlanRole[]).map((r) => (
          <button key={r} onClick={() => setTab(r)} className={`rounded-full px-6 py-2 text-sm font-semibold capitalize transition ${tab === r ? "bg-primary text-primary-content shadow" : "text-base-content/60"}`}>
            For {r}s
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="card-surface flex flex-col p-8">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-4"><span className="font-display text-5xl font-bold">$0</span><span className="text-base-content/60"> / forever</span></p>
          <ul className="my-8 flex-1 space-y-3 text-sm">
            {p.free.map((f) => <li key={f} className="flex gap-2.5"><Check size={18} className="shrink-0 text-success" /> {f}</li>)}
            {p.freeMissing.map((f) => <li key={f} className="flex gap-2.5 text-base-content/40"><X size={18} className="shrink-0" /> {f}</li>)}
          </ul>
          <button className="btn btn-outline w-full" disabled>{user && !isPro ? "Current plan" : "Included"}</button>
        </div>

        <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-neutral p-8 text-neutral-content shadow-xl">
          <span className="absolute -top-3 right-6 flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-content"><Crown size={13} /> Most popular</span>
          <h3 className="text-xl font-semibold text-white">{p.proName}</h3>
          <p className="mt-4"><span className="font-display text-5xl font-bold text-white">${p.price}</span><span className="text-neutral-content/60"> / one-time</span></p>
          <ul className="my-8 flex-1 space-y-3 text-sm">
            {p.pro.map((f) => <li key={f} className="flex gap-2.5"><Check size={18} className="shrink-0 text-secondary" /> {f}</li>)}
          </ul>
          {cta()}
        </div>
      </div>
    </div>
  );
}