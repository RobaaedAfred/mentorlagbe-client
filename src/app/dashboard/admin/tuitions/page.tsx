"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { PageHeader, TableSkeleton } from "@/components/dashboard/widgets";
import { EmptyState, ErrorState, StatusBadge } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { formatDate, money } from "@/lib/utils";
import type { ApprovalStatus, Tuition } from "@/lib/types";

const tabs: { key: "" | ApprovalStatus; label: string }[] = [
  { key: "", label: "All" }, { key: "pending", label: "Pending" }, { key: "approved", label: "Approved" }, { key: "rejected", label: "Rejected" },
];

export default function AdminTuitions() {
  const { data, setData, loading, error, reload } = useFetch<Tuition[]>("/admin/tuitions", true);
  const [tab, setTab] = useState<"" | ApprovalStatus>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const decide = async (t: Tuition, status: "approved" | "rejected") => {
    setBusyId(t._id);
    try {
      await api(`/admin/tuitions/${t._id}/status`, { method: "PATCH", auth: true, body: { status } });
      setData((d) => (d ? d.map((x) => (x._id === t._id ? { ...x, approvalStatus: status } : x)) : d) as Tuition[]);
      toast.success(`Tuition ${status}`);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const rows = (data ?? []).filter((t) => !tab || t.approvalStatus === tab);
  const count = (k: string) => (data ?? []).filter((t) => !k || t.approvalStatus === k).length;

  return (
    <>
      <PageHeader title="Tuition Approval" subtitle="Review tutor submissions before they go public." />
      <div role="tablist" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.key} role="tab" onClick={() => setTab(t.key)} className={`btn btn-sm ${tab === t.key ? "btn-primary" : "btn-outline"}`}>
            {t.label} <span className="badge badge-sm">{count(t.key)}</span>
          </button>
        ))}
      </div>
      {loading ? <TableSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : !rows.length ? (
        <EmptyState title="Nothing to show here" text="No tuitions in this category." />
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="table">
            <thead><tr><th>Tuition</th><th>Tutor</th><th>Fee</th><th>Posted</th><th>Status</th><th className="text-right">Decision</th></tr></thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t._id} className="hover">
                  <td className="min-w-[260px]">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.bannerImage} alt="" className="h-12 w-16 rounded-lg object-cover" />
                      <div>
                        {t.approvalStatus === "approved" ? <Link href={`/tuitions/${t._id}`} className="font-semibold hover:text-primary">{t.title}</Link> : <p className="font-semibold">{t.title}</p>}
                        <p className="text-xs text-base-content/50">{t.subject} · {t.classLevel} · {t.mode}</p>
                      </div>
                    </div>
                  </td>
                  <td><p className="text-sm font-medium">{t.tutorName}</p><p className="text-xs text-base-content/50">{t.tutorEmail}</p></td>
                  <td className="whitespace-nowrap font-semibold">{money(t.monthlyFee)}</td>
                  <td className="whitespace-nowrap text-sm">{formatDate(t.createdAt)}</td>
                  <td><StatusBadge status={t.approvalStatus} /></td>
                  <td className="whitespace-nowrap text-right">
                    <button disabled={busyId === t._id || t.approvalStatus === "approved"} onClick={() => decide(t, "approved")} className="btn btn-success btn-xs mr-1"><Check size={13} /> Approve</button>
                    <button disabled={busyId === t._id || t.approvalStatus === "rejected"} onClick={() => decide(t, "rejected")} className="btn btn-error btn-outline btn-xs"><X size={13} /> Reject</button>
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
