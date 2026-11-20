"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Power, Trash2, X } from "lucide-react";
import { PageHeader, TableSkeleton } from "@/components/dashboard/widgets";
import TuitionForm, { type TuitionFormValues } from "@/components/dashboard/TuitionForm";
import { ConfirmDialog, EmptyState, ErrorState, StatusBadge } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { formatDate, money } from "@/lib/utils";
import type { Tuition } from "@/lib/types";

const toForm = (t: Tuition): TuitionFormValues => ({
  title: t.title, subject: t.subject, classLevel: t.classLevel, mode: t.mode, location: t.location,
  monthlyFee: String(t.monthlyFee), daysPerWeek: String(t.daysPerWeek), bannerImage: t.bannerImage, description: t.description,
});

export default function MyTuitions() {
  const { data, loading, error, reload, setData } = useFetch<Tuition[]>("/tutor/tuitions", true);
  const [editing, setEditing] = useState<Tuition | null>(null);
  const [deleting, setDeleting] = useState<Tuition | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async (v: TuitionFormValues) => {
    if (!editing) return;
    setBusy(true);
    try {
      await api(`/tutor/tuitions/${editing._id}`, { method: "PUT", auth: true, body: { ...v, monthlyFee: Number(v.monthlyFee), daysPerWeek: Number(v.daysPerWeek) } });
      toast.success("Tuition updated");
      setEditing(null);
      reload();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (t: Tuition) => {
    try {
      const { isActive } = await api<{ isActive: boolean }>(`/tutor/tuitions/${t._id}/toggle`, { method: "PATCH", auth: true });
      setData((d) => (d ? d.map((x) => (x._id === t._id ? { ...x, isActive } : x)) : d) as Tuition[]);
      toast.success(isActive ? "Tuition is now active" : "Tuition closed");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/tutor/tuitions/${deleting._id}`, { method: "DELETE", auth: true });
      setData((d) => (d ? d.filter((x) => x._id !== deleting._id) : d) as Tuition[]);
      toast.success("Tuition deleted");
      setDeleting(null);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="My Tuitions" subtitle="Edit, close or delete your posts and watch their approval status." action={<Link href="/dashboard/tutor/post-tuition" className="btn btn-primary btn-sm">New tuition</Link>} />
      {loading ? <TableSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : !data?.length ? (
        <EmptyState title="You haven't posted anything yet" action={<Link href="/dashboard/tutor/post-tuition" className="btn btn-primary btn-sm">Post your first tuition</Link>} />
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="table">
            <thead><tr><th>Tuition</th><th>Fee</th><th>Approval</th><th>Active</th><th>Posted</th><th className="text-right">Actions</th></tr></thead>
            <tbody>
              {data.map((t) => (
                <tr key={t._id} className="hover">
                  <td className="min-w-[260px]">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.bannerImage} alt="" className="h-12 w-16 rounded-lg object-cover" />
                      <div><p className="font-semibold">{t.title}</p><p className="text-xs text-base-content/50">{t.subject} · {t.classLevel} · {t.mode}</p></div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap font-semibold">{money(t.monthlyFee)}</td>
                  <td><StatusBadge status={t.approvalStatus} /></td>
                  <td>
                    <button onClick={() => toggle(t)} className={`badge cursor-pointer gap-1 ${t.isActive ? "badge-success" : "badge-ghost"}`} title="Toggle Active / Closed">
                      <Power size={11} /> {t.isActive ? "Active" : "Closed"}
                    </button>
                  </td>
                  <td className="whitespace-nowrap text-sm">{formatDate(t.createdAt)}</td>
                  <td className="whitespace-nowrap text-right">
                    <button onClick={() => setEditing(t)} className="btn btn-ghost btn-sm btn-square" aria-label="Edit"><Pencil size={16} /></button>
                    <button onClick={() => setDeleting(t)} className="btn btn-ghost btn-sm btn-square text-error" aria-label="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <button onClick={() => setEditing(null)} className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3" aria-label="Close"><X size={18} /></button>
            <h3 className="mb-1 font-display text-xl font-bold">Edit tuition</h3>
            {editing.approvalStatus === "rejected" && <p className="mb-4 text-xs text-warning">Saving a rejected post sends it back for admin review.</p>}
            <div className="mt-4"><TuitionForm initial={toForm(editing)} submitLabel="Save changes" busy={busy} onSubmit={save} onCancel={() => setEditing(null)} /></div>
          </div>
          <div className="modal-backdrop bg-black/40" onClick={() => setEditing(null)} />
        </div>
      )}
      <ConfirmDialog open={!!deleting} busy={busy} title="Delete this tuition?" text="The post and all of its applications will be permanently removed." confirmLabel="Delete" onConfirm={remove} onCancel={() => setDeleting(null)} />
    </>
  );
}
