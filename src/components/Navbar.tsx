"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, Menu, UserCog, X } from "lucide-react";
import { useAuth } from "./providers/AuthProvider";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { Avatar, RoleBadge } from "./ui";

const links = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "How It Works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    setOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(l.href) ? "bg-primary/10 text-primary" : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loading ? (
            <span className="skeleton-box hidden h-9 w-32 sm:block" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition hover:bg-base-200">
                <Avatar name={user.name} src={user.image} size={36} />
                <span className="hidden text-left leading-tight md:block">
                  <span className="block max-w-[130px] truncate text-sm font-semibold">{user.name}</span>
                  <RoleBadge role={user.role} />
                </span>
              </button>
              <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
                <li className="mb-1 border-b border-base-300 px-3 pb-2 md:hidden">
                  <span className="block font-semibold">{user.name}</span>
                  <RoleBadge role={user.role} />
                </li>
                <li>
                  <Link href="/dashboard"><LayoutDashboard size={16} /> Dashboard</Link>
                </li>
                <li>
                  <Link href="/dashboard/profile"><UserCog size={16} /> Update Profile</Link>
                </li>
                <li>
                  <button onClick={handleSignOut} className="text-error"><LogOut size={16} /> Sign Out</button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/sign-in" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/sign-up" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
          <button className="btn btn-ghost btn-circle btn-sm lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-2.5 text-sm font-medium ${isActive(l.href) ? "bg-primary/10 text-primary" : ""}`}>
                {l.label}
              </Link>
            ))}
            {!user && !loading && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/sign-in" onClick={() => setOpen(false)} className="btn btn-outline btn-sm">Sign In</Link>
                <Link href="/sign-up" onClick={() => setOpen(false)} className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}