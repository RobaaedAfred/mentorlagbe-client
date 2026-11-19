"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, PanelLeftClose, PanelLeftOpen, Menu, X } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";
import { Avatar, PageLoader, PlanBadge, RoleBadge } from "../ui";
import { dashboardNav } from "./nav";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Only redirect once auth has fully resolved, so a page reload never bounces a signed-in user.
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const other = (["student", "tutor", "admin"] as const).filter((r) => r !== user.role).some((r) => pathname.startsWith(`/dashboard/${r}`));
    if (pathname === "/dashboard" || other) router.replace(`/dashboard/${user.role}`);
  }, [loading, user, pathname, router]);

  useEffect(() => setMobileOpen(false), [pathname]);

  if (loading || !user) return <PageLoader label="Loading your dashboard..." />;

  const items = dashboardNav[user.role];
  const active = (href: string) => (href.split("/").length <= 3 ? pathname === href : pathname === href || pathname.startsWith(href + "/"));

  const sidebar = (compact: boolean) => (
    <div className="flex h-full flex-col">
      <div className={`flex items-center gap-3 border-b border-base-300 p-4 ${compact ? "justify-center" : ""}`}>
        <Avatar name={user.name} src={user.image} size={compact ? 38 : 46} />
        {!compact && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-base-content/50">{user.email}</p>
            <div className="mt-1.5 flex gap-1.5"><RoleBadge role={user.role} /><PlanBadge plan={user.plan} /></div>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            title={i.label}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${compact ? "justify-center" : ""} ${
              active(i.href) ? "bg-primary text-primary-content shadow" : "text-base-content/70 hover:bg-base-200"
            }`}
          >
            <i.icon size={18} className="shrink-0" />
            {!compact && i.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-base-300 p-3">
        <button
          onClick={async () => { await signOut(); toast.success("Signed out successfully"); router.push("/"); }}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error transition hover:bg-error/10 ${compact ? "justify-center" : ""}`}
        >
          <LogOut size={18} /> {!compact && "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      {/* desktop sidebar */}
      <aside className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-base-300 bg-base-100 transition-all duration-300 lg:block ${collapsed ? "w-20" : "w-72"}`}>
        {sidebar(collapsed)}
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-base-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-300 p-4">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="btn btn-ghost btn-circle btn-sm" aria-label="Close menu"><X size={18} /></button>
            </div>
            <div className="h-[calc(100%-4.5rem)]">{sidebar(false)}</div>
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="sticky top-16 z-30 flex h-14 items-center justify-between border-b border-base-300 bg-base-100/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileOpen(true)} className="btn btn-ghost btn-circle btn-sm lg:hidden" aria-label="Open menu"><Menu size={19} /></button>
            <button onClick={() => setCollapsed(!collapsed)} className="btn btn-ghost btn-circle btn-sm hidden lg:inline-flex" aria-label="Toggle sidebar">
              {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
            </button>
            <span className="text-sm font-semibold capitalize text-base-content/70">{user.role} dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-base-200">
              <Avatar name={user.name} src={user.image} size={30} />
              <span className="hidden text-sm font-medium sm:block">{user.name.split(" ")[0]}</span>
            </Link>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}