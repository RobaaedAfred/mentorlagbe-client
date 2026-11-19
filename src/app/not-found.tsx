import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[65vh] place-items-center py-20 text-center">
      <div>
        <p className="font-display text-8xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-base-content/60">The page you are looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="btn btn-primary mt-8">Back to Home</Link>
      </div>
    </div>
  );
}