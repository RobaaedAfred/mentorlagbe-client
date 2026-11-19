"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PageHeader, TableSkeleton } from "@/components/dashboard/widgets";
import { ConfirmDialog, EmptyState, ErrorState, StatusBadge } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { formatDate, money } from "@/lib/utils";
import type { Application } from "@/lib/types";

export default function MyApplications() {
  const { data, setData, loading, error, reload } = useFetch<Application[]>("/student/applications", true);
  const [target, setTarget] = useState<Application | null>(null);
  const [busy, setBusy] = useState(false);

  const cancel = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await api(`/student/applications/${target._id}`, { method: "DELETE", auth: true });
      setData((d) => (d ? d.filter((a) => a._id !== target._id) : d) as Application[]);
      toast.success("Application cancelled");
      setTarget(null);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="My Applications" subtitle="Track every tuition you have applied for." />
      {loading ? <TableSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : !data?.length ? (
        <EmptyState title="No applications yet" text="Browse tuitions and apply to get started." action={<Link href="/tuitions" className="btn btn-primary btn-sm">Browse Tuitions</Link>} />
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="table">
            <thead>
              <tr><th>Tuition</th><th>Tutor</th><th>Fee</th><th>Applied</th><th>Status</th><th className="text-right">Action</th></tr>
            </thead>
            <tbody>
              {data.map((a) => (
                <tr key={a._id} className="hover">
                  <td className="min-w-[220px]">
                    <Link href={`/tuitions/${a.tuitionId}`} className="font-semibold hover:text-primary">{a.tuitionTitle}</Link>
                    <p className="text-xs text-base-content/50">{a.subject}</p>
                  </td>
                  <td><p className="text-sm font-medium">{a.tutorName ?? "—"}</p><p className="text-xs text-base-content/50">{a.tutorEmail}</p></td>
                  <td className="whitespace-nowrap font-semibold">{money(a.monthlyFee)}</td>
                  <td className="whitespace-nowrap text-sm">{formatDate(a.appliedAt)}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td className="text-right">
                    {a.status === "pending" ? (
                      <button onClick={() => setTarget(a)} className="btn btn-ghost btn-sm text-error"><Trash2 size={15} /> Cancel</button>
                    ) : <span className="text-xs text-base-content/40">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog open={!!target} busy={busy} title="Cancel application?" text={`Your application for "${target?.tuitionTitle}" will be withdrawn.`} confirmLabel="Yes, cancel it" onConfirm={cancel} onCancel={() => setTarget(null)} />
    </>
  );
}