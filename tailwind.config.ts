import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a1715",
        muted: "#6e655f",
        faint: "#9a918a",
        line: "#e6dfd8",
        paper: "#f7f3ef",
        surface: "#fffdfb",
        sunk: "#efe9e3",
        accent: "#8c5a44",
        // legacy tokens still used by the makeup look pages
        porcelain: "#f4ede8",
        teal: "#8c5a44"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 1px 2px rgba(26,23,21,0.04), 0 12px 32px -12px rgba(26,23,21,0.12)",
        lift: "0 1px 2px rgba(26,23,21,0.06), 0 24px 48px -20px rgba(26,23,21,0.28)"
      },
      letterSpacing: {
        eyebrow: "0.14em"
      }
    }
  },
  plugins: []
};

export default config;
