/** @type {import('next').NextConfig} */
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

const nextConfig = {
  reactStrictMode: true,
  // Proxy every /api call to the Express server. The browser only ever talks to
  // the Next.js origin, so BetterAuth cookies are first-party and there are no CORS issues.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
