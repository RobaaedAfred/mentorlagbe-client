"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GraduationCap, UserRound } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { useAuth } from "@/components/providers/AuthProvider";
import { authClient } from "@/lib/auth-client";
import { EMAIL_RX } from "@/lib/utils";

type SignUpRole = "student" | "tutor";

export default function SignUpPage() {
  const router = useRouter();
  const { user, loading, refresh } = useAuth();
  const [form, setForm] = useState<{ name: string; email: string; password: string; role: SignUpRole }>({ name: "", email: "", password: "", role: "student" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && !busy) router.replace("/dashboard");
  }, [loading, user, busy, router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Full name must be at least 2 characters";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!EMAIL_RX.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    });
    if (error) {
      setBusy(false);
      toast.error(error.message || "Could not create your account");
      return;
    }
    toast.success("Account created! Welcome to MentorLagbe.");
    await refresh();
    setBusy(false);
    router.replace("/dashboard");
  };

  const roles: { value: SignUpRole; title: string; text: string; icon: React.ReactNode }[] = [
    { value: "student", title: "I'm a Student", text: "Find tutors & apply", icon: <UserRound size={20} /> },
    { value: "tutor", title: "I'm a Tutor", text: "Post batches & teach", icon: <GraduationCap size={20} /> },
  ];

  return (
    <AuthShell title="Create your account" subtitle="Join as a student or a tutor — it takes less than a minute.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((r) => (
            <button
              type="button"
              key={r.value}
              onClick={() => setForm({ ...form, role: r.value })}
              className={`rounded-xl border-2 p-3.5 text-left transition ${form.role === r.value ? "border-primary bg-primary/10" : "border-base-300 hover:border-primary/40"}`}
            >
              <span className="text-primary">{r.icon}</span>
              <span className="mt-1.5 block text-sm font-semibold">{r.title}</span>
              <span className="block text-xs text-base-content/60">{r.text}</span>
            </button>
          ))}
        </div>

        <label className="form-control">
          <span className="label-text mb-1.5 font-medium">Full name</span>
          <input className={`input-field ${errors.name ? "input-error" : ""}`} placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <span className="mt-1 text-xs text-error">{errors.name}</span>}
        </label>
        <label className="form-control">
          <span className="label-text mb-1.5 font-medium">Email</span>
          <input type="email" className={`input-field ${errors.email ? "input-error" : ""}`} placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <span className="mt-1 text-xs text-error">{errors.email}</span>}
        </label>
        <label className="form-control">
          <span className="label-text mb-1.5 font-medium">Password</span>
          <input type="password" className={`input-field ${errors.password ? "input-error" : ""}`} placeholder="At least 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {errors.password && <span className="mt-1 text-xs text-error">{errors.password}</span>}
        </label>
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />} Create Account
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-base-content/60">
        Already registered? <Link href="/sign-in" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}