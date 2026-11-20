export type Role = "student" | "tutor" | "admin";
export type Plan = "free" | "pro";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface Profile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  plan: Plan;
  phone: string;
  bio: string;
  bookmarks: string[];
  createdAt: string;
}

export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  createdAt: string;
}

export interface TutorSummary {
  name: string;
  image: string | null;
  bio: string;
  verified: boolean;
  joinedAt: string;
  activeTuitions: number;
}

export interface TuitionDetails extends Tuition {
  tutor: TutorSummary | null;
}

export interface TuitionList {
  items: Tuition[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  tutorName?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface Payment {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: Role;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  plan?: Plan;
  phone?: string;
  createdAt: string;
}
