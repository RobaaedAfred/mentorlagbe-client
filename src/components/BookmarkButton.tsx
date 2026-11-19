"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useAuth } from "./providers/AuthProvider";
import { api, errorMessage } from "@/lib/api";

/** Visible only to students. Optimistic toggle backed by /student/bookmarks. */
export default function BookmarkButton({ tuitionId, className = "" }: { tuitionId: string; className?: string }) {
  const { user, refresh } = useAuth();
  const [busy, setBusy] = useState(false);
  if (!user || user.role !== "student") return null;
  const saved = user.bookmarks.includes(tuitionId);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    try {
      await api(`/student/bookmarks/${tuitionId}`, { method: saved ? "DELETE" : "POST", auth: true });
      await refresh();
      toast.success(saved ? "Removed from saved tuitions" : "Saved to your dashboard");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <button onClick={toggle} disabled={busy} aria-label={saved ? "Remove bookmark" : "Save tuition"} className={`grid h-9 w-9 place-items-center rounded-full bg-base-100/90 shadow backdrop-blur transition hover:scale-110 ${className}`}>
      <Heart size={17} className={saved ? "fill-accent text-accent" : "text-base-content/70"} />
    </button>
  );
}