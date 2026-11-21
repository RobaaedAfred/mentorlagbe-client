"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { useAuth } from "@/components/providers/AuthProvider";
import { authClient } from "@/lib/auth-client";
import { EMAIL_RX } from "@/lib/utils";

const demo = [
  { label: "Admin", email: "admin@mentorlagbe.com" },
  { label: "Tutor", email: "farhana@mentorlagbe.com" },
  { label: "Student", email: "rafi@mentorlagbe.com" },
];

export default function SignInPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const goNext = () => {
    const next = new URLSearchParams(window.location.search).get("redirect");
    router.replace(next && next.startsWith("/") ? next : "/dashboard");
  };

  useEffect(() => {
    if (!loading && user) goNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const validate = () => {
    const e: Record<string, string> = {};
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
    const { error } = await authClient.signIn.email({ email: form.email.trim(), password: form.password });
    setBusy(false);
    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }
    toast.success("Welcome back!");
    goNext();
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your tuitions and applications.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <label className="form-control">
          <span className="label-text mb-1.5 font-medium">Email</span>
          <input type="email" className={`input-field ${errors.email ? "input-error" : ""}`} placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <span className="mt-1 text-xs text-error">{errors.email}</span>}
        </label>
        <label className="form-control">
          <span className="label-text mb-1.5 font-medium">Password</span>
          <div className="relative">
            <input type={show ? "text" : "password"} className={`input-field pr-11 ${errors.password ? "input-error" : ""}`} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50" aria-label="Toggle password">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className="mt-1 text-xs text-error">{errors.password}</span>}
        </label>
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />} Sign In
        </button>
      </form>

      <div className="divider my-6 text-xs text-base-content/50">Quick demo login for assessment</div>
      <div className="grid grid-cols-3 gap-2">
        {demo.map((d) => (
          <button key={d.label} type="button" className="btn btn-outline btn-sm" onClick={() => { setForm({ email: d.email, password: "Mentor@123" }); setErrors({}); }}>
            {d.label}
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-base-content/60">
        New to MentorLagbe? <Link href="/sign-up" className="font-semibold text-primary hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}
