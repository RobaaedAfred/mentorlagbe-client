import type { Metadata } from "next";
import { Suspense } from "react";
import BrowseTuitions from "@/components/BrowseTuitions";
import { PageLoader } from "@/components/ui";

export const metadata: Metadata = { title: "Browse Tuitions" };

export default function TuitionsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <BrowseTuitions />
    </Suspense>
  );
}