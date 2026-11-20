import Hero from "@/components/home/Hero";
import FeaturedTuitions from "@/components/home/FeaturedTuitions";
import HowItWorks from "@/components/home/HowItWorks";
import SubjectsStats from "@/components/home/SubjectsStats";
import PricingCards from "@/components/PricingCards";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedTuitions />
      <HowItWorks />
      <SubjectsStats />
      <section className="bg-base-100 py-20">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow">Plans</p>
            <h2 className="section-title mt-2">Free or Pro — you choose</h2>
            <p className="section-sub mx-auto">Start free. Upgrade to Pro for unlimited tuition posts or priority booking.</p>
          </div>
          <PricingCards />
        </div>
      </section>
    </>
  );
}
