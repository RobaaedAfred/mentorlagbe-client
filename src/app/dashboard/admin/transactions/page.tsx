"use client";

import { PageHeader, TableSkeleton } from "@/components/dashboard/widgets";
import { RoleBadge, EmptyState, ErrorState } from "@/components/ui";
import { useFetch } from "@/lib/use-fetch";
import { formatDate } from "@/lib/utils";
import type { Payment } from "@/lib/types";

export default function AdminTransactions() {
  const { data, loading, error, reload } = useFetch<Payment[]>("/admin/transactions", true);
  const total = (data ?? []).reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <PageHeader title="Transactions" subtitle="All Stripe subscription payments." action={data?.length ? <span className="badge badge-lg badge-primary badge-outline font-semibold">Total: ${total.toLocaleString("en-US")}</span> : undefined} />
      {loading ? <TableSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : !data?.length ? (
        <EmptyState title="No transactions yet" text="Payments appear here after users upgrade to Pro." />
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="table">
            <thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Amount</th><th>Transaction ID</th><th>Paid on</th></tr></thead>
            <tbody>
              {data.map((p) => (
                <tr key={p._id} className="hover">
                  <td className="min-w-[200px]"><p className="font-semibold">{p.userName}</p><p className="text-xs text-base-content/50">{p.userEmail}</p></td>
                  <td><RoleBadge role={p.userRole} /></td>
                  <td className="whitespace-nowrap text-sm">{p.planName}</td>
                  <td className="whitespace-nowrap font-semibold">${p.amount} <span className="text-xs uppercase text-base-content/40">{p.currency}</span></td>
                  <td className="max-w-[220px] truncate font-mono text-xs" title={p.transactionId}>{p.transactionId}</td>
                  <td className="whitespace-nowrap text-sm">{formatDate(p.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}