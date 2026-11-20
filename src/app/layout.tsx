import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import AuthProvider from "@/components/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import FooterGate from "@/components/FooterGate";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: { default: "MentorLagbe — Find Your Ideal Tutor", template: "%s | MentorLagbe" },
  description: "Smart tuition & mentorship platform. Browse verified tutors by subject, class level and mode, apply in minutes and track every application.",
};

// Applies the saved theme before first paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem('ml-theme');document.documentElement.setAttribute('data-theme',t==='mentordark'?'mentordark':'mentor')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="mentor" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">
        <AuthProvider>
          <a href="#content" className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-content focus:not-sr-only focus:absolute focus:left-4 focus:top-4">Skip to content</a>
          <Navbar />
          <main id="content" className="min-h-[70vh]">{children}</main>
          <FooterGate />
        </AuthProvider>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
