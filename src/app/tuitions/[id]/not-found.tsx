import Link from "next/link";

export default function TuitionNotFound() {
  return (
    <div className="container-page grid min-h-[55vh] place-items-center py-20 text-center">
      <div>
        <h1 className="text-3xl font-bold">This tuition is no longer available</h1>
        <p className="mt-3 text-base-content/60">It may have been closed or removed by the tutor.</p>
        <Link href="/tuitions" className="btn btn-primary mt-8">Browse Tuitions</Link>
      </div>
    </div>
  );
}