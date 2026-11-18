import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(18px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
      animation: { "fade-up": "fade-up .7s ease-out both", float: "float 6s ease-in-out infinite" },
    },
  },
  plugins: [daisyui],
  daisyui: {
    logs: false,
    themes: [
      {
        mentor: {
          primary: "#0f766e",
          "primary-content": "#ffffff",
          secondary: "#f59e0b",
          "secondary-content": "#1c1917",
          accent: "#e11d48",
          neutral: "#12332f",
          "neutral-content": "#f4efe6",
          "base-100": "#ffffff",
          "base-200": "#f7f3ec",
          "base-300": "#e8e1d3",
          "base-content": "#1c2b29",
          info: "#0369a1",
          success: "#15803d",
          warning: "#d97706",
          error: "#dc2626",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.75rem",
        },
      },
      {
        mentordark: {
          primary: "#2dd4bf",
          "primary-content": "#042f2e",
          secondary: "#fbbf24",
          "secondary-content": "#1c1917",
          accent: "#fb7185",
          neutral: "#0b1f1d",
          "neutral-content": "#e7e2d8",
          "base-100": "#10201e",
          "base-200": "#0b1715",
          "base-300": "#1d332f",
          "base-content": "#e7efec",
          info: "#38bdf8",
          success: "#4ade80",
          warning: "#fbbf24",
          error: "#f87171",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.75rem",
        },
      },
    ],
  },
};
export default config;
