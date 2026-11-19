import { Bookmark, ClipboardList, CreditCard, FilePlus2, LayoutDashboard, LibraryBig, Receipt, ShieldCheck, UserCog, Users } from "lucide-react";
import type { Role } from "@/lib/types";

export const dashboardNav: Record<Role, { href: string; label: string; icon: typeof LayoutDashboard }[]> = {
  student: [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/student/my-applications", label: "My Applications", icon: ClipboardList },
    { href: "/dashboard/student/saved", label: "Saved Tuitions", icon: Bookmark },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
    { href: "/pricing", label: "Upgrade Plan", icon: CreditCard },
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/tutor/post-tuition", label: "Post a Tuition", icon: FilePlus2 },
    { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", icon: LibraryBig },
    { href: "/dashboard/tutor/applicants", label: "Applicants", icon: Users },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
    { href: "/pricing", label: "Upgrade Plan", icon: CreditCard },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/tuitions", label: "Tuition Approval", icon: ShieldCheck },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
  ],
};