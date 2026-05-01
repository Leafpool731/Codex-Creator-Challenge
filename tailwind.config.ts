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
        ink: "#171313",
        paper: "#fffaf4",
        porcelain: "#f7ece7",
        rose: "#c96372",
        coral: "#e4815d",
        saffron: "#d6a142",
        sage: "#7c9a84",
        teal: "#327c83"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(45, 32, 28, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
