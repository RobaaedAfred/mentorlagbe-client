"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { PHONE_RX } from "@/lib/utils";

export default function ApplyModal({ tuitionId, title, onClose, onApplied }: { tuitionId: string; title: string; onClose: () => void; onApplied: () => void }) {
  const [form, setForm] = useState({ studentPhone: "", preferredSchedule: "", studentNote: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!PHONE_RX.test(form.studentPhone.trim())) err.studentPhone = "Enter a valid phone number";
    if (form.preferredSchedule.trim().length < 3) err.preferredSchedule = "Tell the tutor when you are free";
    if (form.studentNote.trim().length < 10) err.studentNote = "Write at least 10 characters";
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    try {
      await api("/student/applications", { method: "POST", auth: true, body: { tuitionId, ...form } });
      toast.success("Application submitted! The tutor will review it soon.");
      onApplied();
      onClose();
    } catch (e2) {
      toast.error(errorMessage(e2));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal modal-open">
      <form onSubmit={submit} className="modal-box max-w-lg" noValidate>
        <button type="button" onClick={onClose} className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3" aria-label="Close"><X size={18} /></button>
        <h3 className="font-display text-xl font-bold">Apply for this tuition</h3>
        <p className="mb-5 mt-1 line-clamp-1 text-sm text-base-content/60">{title}</p>

        <div className="space-y-4">
          <label className="form-control">
            <span className="label-text mb-1.5 font-medium">Phone number</span>
            <input className={`input-field ${errors.studentPhone ? "input-error" : ""}`} placeholder="+8801XXXXXXXXX" value={form.studentPhone} onChange={(e) => setForm({ ...form, studentPhone: e.target.value })} />
            {errors.studentPhone && <span className="mt-1 text-xs text-error">{errors.studentPhone}</span>}
          </label>
          <label className="form-control">
            <span className="label-text mb-1.5 font-medium">Preferred schedule</span>
            <input className={`input-field ${errors.preferredSchedule ? "input-error" : ""}`} placeholder="e.g. Sat, Mon, Wed — after 5 PM" value={form.preferredSchedule} onChange={(e) => setForm({ ...form, preferredSchedule: e.target.value })} />
            {errors.preferredSchedule && <span className="mt-1 text-xs text-error">{errors.preferredSchedule}</span>}
          </label>
          <label className="form-control">
            <span className="label-text mb-1.5 font-medium">Learning note</span>
            <textarea rows={4} className={`textarea textarea-bordered bg-base-100 ${errors.studentNote ? "textarea-error" : ""}`} placeholder="What do you want to achieve? Any weak topics?" value={form.studentNote} onChange={(e) => setForm({ ...form, studentNote: e.target.value })} />
            {errors.studentNote && <span className="mt-1 text-xs text-error">{errors.studentNote}</span>}
          </label>
        </div>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn btn-primary" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Submit Application</button>
        </div>
      </form>
      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </div>
  );
}