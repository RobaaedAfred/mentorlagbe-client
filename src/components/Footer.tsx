import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import XIcon from "./XIcon";

const quick = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "How It Works" },
];
const account = [
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Create Account" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed text-neutral-content/70">
            Verified tutors, transparent fees and simple booking — find the right mentor for every subject and class level.
          </p>
          <div className="flex gap-2">
            {[
              { icon: <Facebook size={17} />, label: "Facebook" },
              { icon: <XIcon size={16} />, label: "X" },
              { icon: <Instagram size={17} />, label: "Instagram" },
              { icon: <Linkedin size={17} />, label: "LinkedIn" },
            ].map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-primary hover:text-primary-content">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-neutral-content/70">
            {quick.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-primary">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Account</h4>
          <ul className="space-y-2.5 text-sm text-neutral-content/70">
            {account.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-primary">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-neutral-content/70">
            <li className="flex items-center gap-2.5"><Mail size={16} className="text-primary" /> support@mentorlagbe.com</li>
            <li className="flex items-center gap-2.5"><Phone size={16} className="text-primary" /> +880 1700-000000</li>
            <li className="flex items-center gap-2.5"><MapPin size={16} className="text-primary" /> Dhanmondi, Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-neutral-content/60">
        © {new Date().getFullYear()} MentorLagbe. All rights reserved.
      </div>
    </footer>
  );
}
