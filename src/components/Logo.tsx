import Link from "next/link";
import { GraduationCap } from "lucide-react";

/** Same logo size/style everywhere (navbar, footer, dashboard). */
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-content shadow-md">
        <GraduationCap size={20} />
      </span>
      <span className={`font-display text-2xl font-bold tracking-tight ${light ? "text-neutral-content" : "text-base-content"}`}>
        Mentor<span className="text-primary">Lagbe</span>
      </span>
    </Link>
  );
}
