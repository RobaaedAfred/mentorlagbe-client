import type { Metadata } from "next";
import Link from "next/link";
import HowItWorks from "@/components/home/HowItWorks";

export const metadata: Metadata = { title: "How It Works" };

export default function AboutPage() {
  return (
    <>
      <section className="container-page py-16 text-center">
        <p className="eyebrow">About MentorLagbe</p>
        <h1 className="section-title mx-auto mt-2 max-w-3xl">Making quality tuition easy to find — and easy to offer</h1>
        <p className="section-sub mx-auto">
          Students and parents struggle to find verified tutors by subject, class level, mode and budget, while skilled tutors lack a structured place to showcase their batches.
          MentorLagbe brings both sides together with admin-moderated listings, simple applications and transparent pricing.
        </p>
      </section>
      <HowItWorks />
      <section className="container-page py-16 text-center">
        <Link href="/tuitions" className="btn btn-primary">Browse Tuitions</Link>
      </section>
    </>
  );
}