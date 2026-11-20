import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-16">
      <div className="card-surface w-full max-w-md p-10 text-center">
        <XCircle className="mx-auto text-warning" size={64} />
        <h1 className="mt-5 text-3xl font-bold">Payment cancelled</h1>
        <p className="mt-2 text-base-content/60">No charge was made. You can upgrade whenever you&apos;re ready.</p>
        <div className="mt-8 grid gap-3">
          <Link href="/pricing" className="btn btn-primary">Back to Pricing</Link>
          <Link href="/" className="btn btn-ghost">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
