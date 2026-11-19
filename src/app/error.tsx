"use client";

import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page grid min-h-[65vh] place-items-center py-20 text-center">
      <div>
        <p className="font-display text-6xl font-bold text-error">Oops!</p>
        <h1 className="mt-4 text-3xl font-bold">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-base-content/60">{error.message || "An unexpected error occurred."}</p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={reset} className="btn btn-outline">Try again</button>
          <Link href="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}