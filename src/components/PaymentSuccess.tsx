"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "./providers/AuthProvider";
import { PageLoader } from "./ui";
import { api, errorMessage } from "@/lib/api";

interface Result { planName: string; amount: number; transactionId: string }

export default function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const { user, loading, refresh } = useAuth();
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (loading || started.current) return;
    if (!user) { setError("Please sign in to verify your payment."); return; }
    if (!sessionId) { setError("Missing checkout session."); return; }
    started.current = true;
    api<Result>(`/payments/verify?session_id=${encodeURIComponent(sessionId)}`, { auth: true })
      .then(async (r) => { setResult(r); await refresh(); toast.success("You're now on the Pro plan!"); })
      .catch((e) => { setError(errorMessage(e)); toast.error(errorMessage(e)); });
  }, [loading, user, sessionId, refresh]);

  if (!result && !error) return <PageLoader label="Verifying your payment..." />;

  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-16">
      <div className="card-surface w-full max-w-md p-10 text-center">
        {result ? (
          <>
            <CheckCircle2 className="mx-auto text-success" size={64} />
            <h1 className="mt-5 text-3xl font-bold">Payment successful</h1>
            <p className="mt-2 text-base-content/60">Your account has been upgraded to <b>{result.planName}</b>.</p>
            <dl className="mt-6 space-y-2 rounded-xl bg-base-200 p-4 text-left text-sm">
              <div className="flex justify-between"><dt className="text-base-content/60">Amount</dt><dd className="font-semibold">${result.amount}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-base-content/60">Transaction</dt><dd className="truncate font-mono text-xs">{result.transactionId}</dd></div>
            </dl>
            <Link href="/dashboard" className="btn btn-primary mt-8 w-full">Go to Dashboard</Link>
          </>
        ) : (
          <>
            <XCircle className="mx-auto text-error" size={64} />
            <h1 className="mt-5 text-2xl font-bold">We couldn&apos;t verify the payment</h1>
            <p className="mt-2 text-base-content/60">{error}</p>
            <Link href="/pricing" className="btn btn-primary mt-8 w-full">Back to Pricing</Link>
          </>
        )}
      </div>
    </div>
  );
}