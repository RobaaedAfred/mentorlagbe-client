import { Suspense } from "react";
import PaymentSuccess from "@/components/PaymentSuccess";
import { PageLoader } from "@/components/ui";

export const metadata = { title: "Payment Successful" };

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PaymentSuccess />
    </Suspense>
  );
}