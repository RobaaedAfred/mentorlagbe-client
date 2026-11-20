"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// No baseURL: requests go to /api/auth/* on the Next.js origin, which is proxied to Express.
export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false },
        plan: { type: "string", required: false },
        phone: { type: "string", required: false },
        bio: { type: "string", required: false },
      },
    }),
  ],
});
