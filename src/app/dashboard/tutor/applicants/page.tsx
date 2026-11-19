"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { PageHeader, TableSkeleton } from "@/components/dashboard/widgets";
import { EmptyState, ErrorState, StatusBadge } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { formatDate } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/lib/types";

export default function Applicants() {
  const { data, setData, loading, error, reload } = useFetch<Application[]>("/tutor/applicants", true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const update = async (a: Application, status: "accepted" | "rejected") => {
    setBusyId(a._id);
    try {
      await api(`/tutor/applications/${a._id}/status`, { method: "PATCH", auth: true, body: { status } });
      setData((d) => (d ? d.map((x) => (x._id === a._id ? { ...x, status: status as ApplicationStatus } : x)) : d) as Application[]);
      toast.success(`Application ${status}`);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader title="Applicants" subtitle="Students who applied to your tuitions." />
      {loading ? <TableSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : !data?.length ? (
        <EmptyState title="No applicants yet" text="Once students apply to your approved tuitions they will show up here." />
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="table">
            <thead><tr><th>Student</th><th>Tuition</th><th>Contact</th><th>Schedule & note</th><th>Applied</th><th>Status</th><th className="text-right">Decision</th></tr></thead>
            <tbody>
              {data.map((a) => (
                <tr key={a._id} className="hover align-top">
                  <td className="min-w-[160px]"><p className="font-semibold">{a.studentName}</p><p className="text-xs text-base-content/50">{a.studentEmail}</p></td>
                  <td className="min-w-[180px] text-sm">{a.tuitionTitle}</td>
                  <td className="whitespace-nowrap text-sm">{a.studentPhone}</td>
                  <td className="min-w-[240px] text-sm"><p className="font-medium">{a.preferredSchedule}</p><p className="mt-1 text-xs text-base-content/60">{a.studentNote}</p></td>
                  <td className="whitespace-nowrap text-sm">{formatDate(a.appliedAt)}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td className="whitespace-nowrap text-right">
                    <button disabled={busyId === a._id || a.status === "accepted"} onClick={() => update(a, "accepted")} className="btn btn-success btn-xs mr-1"><Check size={13} /> Accept</button>
                    <button disabled={busyId === a._id || a.status === "rejected"} onClick={() => update(a, "rejected")} className="btn btn-error btn-outline btn-xs"><X size={13} /> Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}