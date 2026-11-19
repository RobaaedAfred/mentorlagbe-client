"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import { errorMessage, uploadImage } from "@/lib/api";
import { CLASS_LEVELS, SUBJECTS } from "@/lib/utils";

export interface TuitionFormValues {
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: string;
  daysPerWeek: string;
  bannerImage: string;
  description: string;
}

export const emptyTuition: TuitionFormValues = {
  title: "", subject: "", classLevel: "", mode: "Online", location: "", monthlyFee: "", daysPerWeek: "3", bannerImage: "", description: "",
};

export default function TuitionForm({
  initial = emptyTuition, submitLabel, busy, onSubmit, onCancel,
}: {
  initial?: TuitionFormValues; submitLabel: string; busy?: boolean; onSubmit: (v: TuitionFormValues) => void; onCancel?: () => void;
}) {
  const [v, setV] = useState<TuitionFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof TuitionFormValues>(k: K, val: TuitionFormValues[K]) => setV((p) => ({ ...p, [k]: val }));

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      set("bannerImage", await uploadImage(file));
      toast.success("Banner uploaded");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (v.title.trim().length < 5) err.title = "Title must be at least 5 characters";
    if (!v.subject.trim()) err.subject = "Subject is required";
    if (!v.classLevel) err.classLevel = "Select a class level";
    if (!v.location.trim()) err.location = "Location is required";
    if (!(Number(v.monthlyFee) > 0)) err.monthlyFee = "Enter a fee greater than 0";
    const d = Number(v.daysPerWeek);
    if (!(d >= 1 && d <= 7)) err.daysPerWeek = "Between 1 and 7 days";
    if (!v.bannerImage) err.bannerImage = "Upload a banner image";
    if (v.description.trim().length < 30) err.description = "Description must be at least 30 characters";
    setErrors(err);
    if (Object.keys(err).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    onSubmit(v);
  };

  const Err = ({ k }: { k: string }) => (errors[k] ? <span className="mt-1 text-xs text-error">{errors[k]}</span> : null);
  const cls = (k: string) => `input-field ${errors[k] ? "input-error" : ""}`;

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <label className="form-control sm:col-span-2">
        <span className="label-text mb-1.5 font-medium">Title</span>
        <input className={cls("title")} placeholder="e.g. HSC Physics Complete Batch" value={v.title} onChange={(e) => set("title", e.target.value)} />
        <Err k="title" />
      </label>
      <label className="form-control">
        <span className="label-text mb-1.5 font-medium">Subject</span>
        <input list="subjects" className={cls("subject")} placeholder="Math, Physics..." value={v.subject} onChange={(e) => set("subject", e.target.value)} />
        <datalist id="subjects">{SUBJECTS.map((s) => <option key={s} value={s} />)}</datalist>
        <Err k="subject" />
      </label>
      <label className="form-control">
        <span className="label-text mb-1.5 font-medium">Class level</span>
        <select className={`select select-bordered bg-base-100 ${errors.classLevel ? "select-error" : ""}`} value={v.classLevel} onChange={(e) => set("classLevel", e.target.value)}>
          <option value="">Select level</option>
          {CLASS_LEVELS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <Err k="classLevel" />
      </label>
      <label className="form-control">
        <span className="label-text mb-1.5 font-medium">Mode</span>
        <select className="select select-bordered bg-base-100" value={v.mode} onChange={(e) => set("mode", e.target.value as "Online" | "Offline")}>
          <option>Online</option>
          <option>Offline</option>
        </select>
      </label>
      <label className="form-control">
        <span className="label-text mb-1.5 font-medium">Location</span>
        <input className={cls("location")} placeholder="Dhanmondi, Dhaka / Online (Zoom)" value={v.location} onChange={(e) => set("location", e.target.value)} />
        <Err k="location" />
      </label>
      <label className="form-control">
        <span className="label-text mb-1.5 font-medium">Monthly fee (৳)</span>
        <input type="number" min={1} className={cls("monthlyFee")} value={v.monthlyFee} onChange={(e) => set("monthlyFee", e.target.value)} />
        <Err k="monthlyFee" />
      </label>
      <label className="form-control">
        <span className="label-text mb-1.5 font-medium">Days per week</span>
        <input type="number" min={1} max={7} className={cls("daysPerWeek")} value={v.daysPerWeek} onChange={(e) => set("daysPerWeek", e.target.value)} />
        <Err k="daysPerWeek" />
      </label>

      <div className="sm:col-span-2">
        <span className="label-text mb-1.5 block font-medium">Banner image</span>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className={`relative grid h-48 w-full place-items-center overflow-hidden rounded-xl border-2 border-dashed transition hover:border-primary ${errors.bannerImage ? "border-error" : "border-base-300"}`}>
          {v.bannerImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={v.bannerImage} alt="Banner preview" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-2 text-sm text-base-content/50"><ImagePlus size={28} /> Click to upload (JPG/PNG, max 6MB)</span>
          )}
          {uploading && <span className="absolute inset-0 grid place-items-center bg-base-100/70"><span className="loading loading-spinner text-primary" /></span>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
        <Err k="bannerImage" />
      </div>

      <label className="form-control sm:col-span-2">
        <span className="label-text mb-1.5 flex justify-between font-medium">Description <span className="text-base-content/40">{v.description.length} chars</span></span>
        <textarea rows={5} className={`textarea textarea-bordered bg-base-100 ${errors.description ? "textarea-error" : ""}`} placeholder="Syllabus covered, teaching style, weekly tests..." value={v.description} onChange={(e) => set("description", e.target.value)} />
        <Err k="description" />
      </label>

      <div className="flex justify-end gap-3 sm:col-span-2">
        {onCancel && <button type="button" onClick={onCancel} className="btn btn-ghost" disabled={busy}>Cancel</button>}
        <button className="btn btn-primary" disabled={busy || uploading}>{busy && <span className="loading loading-spinner loading-sm" />} {submitLabel}</button>
      </div>
    </form>
  );
}