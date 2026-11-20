"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import TuitionForm, { type TuitionFormValues } from "@/components/dashboard/TuitionForm";
import { PageLoader } from "@/components/ui";
import { api, ApiError, errorMessage } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";

export default function PostTuition() {
  const router = useRouter();
  const stats = useFetch<{ total: number; limit: number | null }>("/tutor/stats", true);
  const [busy, setBusy] = useState(false);

  if (stats.loading) return <PageLoader />;
  const reached = !!stats.data?.limit && stats.data.total >= stats.data.limit;

  const submit = async (v: TuitionFormValues) => {
    setBusy(true);
    try {
      await api("/tutor/tuitions", { method: "POST", auth: true, body: { ...v, monthlyFee: Number(v.monthlyFee), daysPerWeek: Number(v.daysPerWeek) } });
      toast.success("Tuition submitted for admin approval");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (e) {
      toast.error(e instanceof ApiError && e.code === "PLAN_LIMIT" ? e.message : errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Post a Tuition" subtitle="New posts are reviewed by an admin before they go live." />
      {reached ? (
        <div className="card-surface flex flex-col items-center gap-3 p-12 text-center">
          <Lock size={36} className="text-warning" />
          <h2 className="text-xl font-bold">Free plan limit reached</h2>
          <p className="max-w-md text-sm text-base-content/60">Free tutors can post up to {stats.data?.limit} tuitions. Upgrade to Pro for unlimited posts and a verified badge.</p>
          <Link href="/pricing" className="btn btn-secondary mt-2">Upgrade to Pro</Link>
        </div>
      ) : (
        <div className="card-surface p-6 sm:p-8">
          {stats.data?.limit && <p className="mb-5 rounded-lg bg-info/10 p-3 text-sm text-base-content/70">Free plan: {stats.data.total} of {stats.data.limit} posts used.</p>}
          <TuitionForm submitLabel="Submit for approval" busy={busy} onSubmit={submit} />
        </div>
      )}
    </>
  );
}
