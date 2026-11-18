import { ClipboardCheck, FilePlus2, Search, ShieldCheck, UserCheck, Send } from "lucide-react";

const studentSteps = [
  { icon: Search, title: "Search & filter", text: "Browse approved tuitions by subject, class level and mode." },
  { icon: Send, title: "Apply in minutes", text: "Share your schedule and learning goals with one short form." },
  { icon: UserCheck, title: "Get accepted", text: "Track the tutor's decision live from your dashboard." },
];
const tutorSteps = [
  { icon: FilePlus2, title: "Post your batch", text: "Create a listing with banner, fee, schedule and description." },
  { icon: ShieldCheck, title: "Admin approval", text: "We review each post so students only see trusted listings." },
  { icon: ClipboardCheck, title: "Manage applicants", text: "Accept or reject students and grow your batch." },
];

function Track({ label, steps }: { label: string; steps: typeof studentSteps }) {
  return (
    <div className="card-surface p-7">
      <p className="eyebrow mb-6">{label}</p>
      <ol className="space-y-6">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <s.icon size={22} />
              <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-secondary text-[11px] font-bold text-secondary-content">{i + 1}</span>
            </span>
            <div>
              <h3 className="font-sans text-base font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-base-content/60">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="bg-base-100 py-20">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">Simple by design</p>
          <h2 className="section-title mt-2">How MentorLagbe Works</h2>
          <p className="section-sub mx-auto">One platform, two journeys — whether you want to learn or to teach.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Track label="For students" steps={studentSteps} />
          <Track label="For tutors" steps={tutorSteps} />
        </div>
      </div>
    </section>
  );
}