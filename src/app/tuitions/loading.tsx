import { CardSkeletonGrid } from "@/components/ui";

export default function Loading() {
  return (
    <div className="container-page py-12">
      <div className="skeleton-box mb-3 h-5 w-24" />
      <div className="skeleton-box mb-8 h-10 w-72" />
      <div className="skeleton-box mb-8 h-24" />
      <CardSkeletonGrid count={9} />
    </div>
  );
}
