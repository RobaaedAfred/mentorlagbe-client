"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { PageHeader, TableSkeleton } from "@/components/dashboard/widgets";
import { useAuth } from "@/components/providers/AuthProvider";
import { Avatar, EmptyState, ErrorState, PlanBadge } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { formatDate } from "@/lib/utils";
import type { AdminUser, Role } from "@/lib/types";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const { data, setData, loading, error, reload } = useFetch<AdminUser[]>("/admin/users", true);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");

  const rows = useMemo(
    () => (data ?? []).filter((u) => (!role || u.role === role) && (!q || `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()))),
    [data, q, role],
  );

  const changeRole = async (u: AdminUser, next: Role) => {
    try {
      await api(`/admin/users/${u._id}/role`, { method: "PATCH", auth: true, body: { role: next } });
      setData((d) => (d ? d.map((x) => (x._id === u._id ? { ...x, role: next } : x)) : d) as AdminUser[]);
      toast.success(`${u.name} is now a ${next}`);
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <>
      <PageHeader title="User Management" subtitle="View every account and manage roles." />
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_200px]">
        <label className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email..." className="input input-bordered w-full bg-base-100 pl-10" />
        </label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="select select-bordered bg-base-100" aria-label="Filter by role">
          <option value="">All roles</option><option value="student">Students</option><option value="tutor">Tutors</option><option value="admin">Admins</option>
        </select>
      </div>
      {loading ? <TableSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : !rows.length ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="table">
            <thead><tr><th>User</th><th>Phone</th><th>Plan</th><th>Joined</th><th>Role</th></tr></thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u._id} className="hover">
                  <td className="min-w-[220px]">
                    <div className="flex items-center gap-3"><Avatar name={u.name} src={u.image} size={38} /><div><p className="font-semibold">{u.name}</p><p className="text-xs text-base-content/50">{u.email}</p></div></div>
                  </td>
                  <td className="whitespace-nowrap text-sm">{u.phone || "—"}</td>
                  <td><PlanBadge plan={u.plan ?? "free"} /></td>
                  <td className="whitespace-nowrap text-sm">{formatDate(u.createdAt)}</td>
                  <td>
                    <select value={u.role} disabled={u.email === me?.email} onChange={(e) => changeRole(u, e.target.value as Role)} className="select select-bordered select-sm bg-base-100 capitalize" aria-label={`Role for ${u.name}`}>
                      <option value="student">student</option><option value="tutor">tutor</option><option value="admin">admin</option>
                    </select>
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
