import { PageLoader } from "@/components/ui";

// The dashboard shell redirects to /dashboard/<role> once the session is resolved.
export default function DashboardIndex() {
  return <PageLoader label="Opening your dashboard..." />;
}
