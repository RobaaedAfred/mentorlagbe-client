"use client";

import Link from "next/link";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card-surface mx-auto mt-10 max-w-lg p-10 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-base-content/60">{error.message || "This dashboard page failed to load."}</p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={reset} className="btn btn-outline btn-sm">Try again</button>
        <Link href="/" className="btn btn-primary btn-sm">Back to Home</Link>
      </div>
    </div>
  );
}