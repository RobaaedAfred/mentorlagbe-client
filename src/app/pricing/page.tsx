import type { Metadata } from "next";
import PricingCards from "@/components/PricingCards";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="eyebrow">Pro plans</p>
        <h1 className="section-title mt-2">Simple, transparent pricing</h1>
        <p className="section-sub mx-auto">Pay once via secure Stripe Checkout. Your plan upgrades instantly.</p>
      </div>
      <PricingCards />
    </div>
  );
}
