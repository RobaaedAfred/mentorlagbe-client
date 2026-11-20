"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

/** The dashboard is full-width app chrome, so the marketing footer is hidden there. */
export default function FooterGate() {
  return usePathname().startsWith("/dashboard") ? null : <Footer />;
}
