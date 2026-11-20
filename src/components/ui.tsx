import { initials } from "@/lib/utils";
import type { ApplicationStatus, ApprovalStatus, Role } from "@/lib/types";

export function Avatar({ name, src, size = 40 }: { name: string; src?: string | null; size?: number }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} width={size} height={size} style={{ width: size, height: size }} className="rounded-full object-cover ring-2 ring-base-100" />
  ) : (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="grid shrink-0 place-items-center rounded-full bg-primary/15 font-bold text-primary ring-2 ring-base-100"
    >
      {initials(name) || "?"}
    </span>
  );
}

const roleStyle: Record<Role, string> = {
  student: "badge-info",
  tutor: "badge-primary",
  admin: "badge-secondary",
};
export const RoleBadge = ({ role }: { role: Role }) => (
  <span className={`badge badge-sm font-semibold capitalize ${roleStyle[role]}`}>{role}</span>
);

const statusStyle: Record<ApplicationStatus | ApprovalStatus, string> = {
  pending: "badge-warning",
  accepted: "badge-success",
  approved: "badge-success",
  rejected: "badge-error",
};
export const StatusBadge = ({ status }: { status: ApplicationStatus | ApprovalStatus }) => (
  <span className={`badge badge-outline gap-1 font-semibold capitalize ${statusStyle[status]}`}>{status}</span>
);

export const PlanBadge = ({ plan }: { plan: "free" | "pro" }) => (
  <span className={`badge badge-sm font-semibold uppercase ${plan === "pro" ? "badge-secondary" : "badge-ghost"}`}>{plan}</span>
);

export function Spinner({ className = "" }: { className?: string }) {
  return <span className={`loading loading-spinner loading-md text-primary ${className}`} />;
}

export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex flex-col items-center gap-3 text-base-content/60">
        <Spinner />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="card-surface flex flex-col items-center gap-2 px-6 py-14 text-center">
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      {text && <p className="max-w-md text-sm text-base-content/60">{text}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card-surface flex flex-col items-center gap-3 px-6 py-12 text-center">
      <p className="font-semibold text-error">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary btn-sm">
          Try again
        </button>
      )}
    </div>
  );
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-surface overflow-hidden">
          <div className="skeleton-box h-44 rounded-none" />
          <div className="space-y-3 p-5">
            <div className="skeleton-box h-4 w-1/3" />
            <div className="skeleton-box h-5 w-full" />
            <div className="skeleton-box h-5 w-2/3" />
            <div className="skeleton-box h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ConfirmDialog({
  open, title, text, confirmLabel = "Confirm", onConfirm, onCancel, busy,
}: {
  open: boolean; title: string; text: string; confirmLabel?: string; busy?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="py-3 text-sm text-base-content/70">{text}</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="btn btn-error" onClick={onConfirm} disabled={busy}>
            {busy && <span className="loading loading-spinner loading-xs" />} {confirmLabel}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onCancel} />
    </div>
  );
}
