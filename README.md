# MentorLagbe — Client (Next.js)

**Smart Tuition & Mentorship Platform.** MentorLagbe connects verified Tutors who offer subject-wise batches or 1-on-1 mentorship with Students looking for personalised guidance, while Admins moderate listings, users and Stripe subscription payments.

- **Live site:** https://mentorlagbe-three.vercel.app
- **API (server repo):** https://mentorlagbe-server-teal.vercel.app
## Admin credentials (seeded demo data)

| Role    | Email                        | Password     |
| ------- | ---------------------------- | ------------ |
| Admin   | admin@mentorlagbe.com        | Mentor@123   |
| Tutor   | farhana@mentorlagbe.com      | Mentor@123   |
| Student | rafi@mentorlagbe.com         | Mentor@123   |

The sign-in page also has one-click demo buttons that fill these in.

## Key features

- **Role-based auth** (Student / Tutor / Admin) with BetterAuth + JWT; signed-in users stay signed in on any route reload.
- **Home page**: hero with search, 6 latest approved tuitions (equal-height cards), How It Works, top subjects, live platform stats, testimonials, Free vs Pro pricing.
- **Browse Tuitions**: server-side search (title/subject), filters (subject, class level, mode), sorting and pagination (`skip`/`limit`).
- **Tuition details** with tutor summary; only Students can apply (Tutors/Admins see a notice); duplicate applications are blocked.
- **Student dashboard**: stats, My Applications (cancel while pending), Saved Tuitions (bookmarks).
- **Tutor dashboard**: stats, post tuition (free plan = 2 posts, Pro = unlimited), full CRUD, Active/Closed toggle, applicant management (accept/reject).
- **Admin dashboard**: platform stats, user role management, tuition approval/rejection, Stripe transactions.
- **Stripe Checkout** for Pro Tutor ($15) / Pro Student ($10) with `/payment/success` verification and `/payment/cancel`.
- **ImgBB image upload** (profile photo + tuition banner) through the server, so the key never reaches the browser.
- **Dark / Light theme**, responsive collapsible dashboard sidebar, skeleton loaders, custom 404 and error pages, sonner toasts everywhere.

## Tech stack & npm packages

`next` 14 (App Router) · `react` 18 · `typescript` · `tailwindcss` 3 · `daisyui` 4 · `better-auth` · `sonner` · `lucide-react` · `next/font` (Inter, Fraunces).

## Getting started

```bash
npm install
cp  .env.local   # set NEXT_PUBLIC_API_URL
npm run dev                  # http://localhost:3000
```

| Variable              | Purpose                                                        |
| --------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API. Next.js proxies `/api/*` to it.   |

### How the API is reached

`next.config.mjs` rewrites `/api/:path*` to the Express server. The browser therefore only talks to the Next.js origin, which keeps BetterAuth cookies first-party (no cross-site cookie or CORS problems in production). On the server set `CLIENT_URL` to this site's URL.

### Deploying (Vercel)

1. Deploy the server first, then set `NEXT_PUBLIC_API_URL` to its URL in the client project's environment variables.
2. Add the client URL to the server's `CLIENT_URL` (CORS + BetterAuth trusted origins).
3. In Stripe, point the webhook to `https://<server>/api/payments/webhook` (success-page verification also upgrades the plan if the webhook is delayed).
