import { StatsSkeleton, TableSkeleton } from "@/components/dashboard/widgets";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="skeleton-box h-9 w-64" />
      <StatsSkeleton />
      <TableSkeleton />
    </div>
  );
}