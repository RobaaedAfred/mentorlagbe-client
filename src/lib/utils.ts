export const money = (n: number, currency = "BDT") =>
  currency === "BDT" ? `৳${n.toLocaleString("en-US")}` : `$${n.toLocaleString("en-US")}`;

export const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

export const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RX = /^[+\d][\d\s-]{6,17}$/;

export const CLASS_LEVELS = ["Class 6-8", "SSC", "HSC", "O-Level", "A-Level", "University", "Professional"];
export const SUBJECTS = ["Math", "Physics", "Chemistry", "Biology", "English", "IELTS", "Programming", "ICT", "Accounting"];
