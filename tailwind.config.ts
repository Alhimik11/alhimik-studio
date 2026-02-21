import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        mutedext: "rgb(var(--color-muted) / <alpha-value>)",
        cyan: {
          200: "#d7bcff",
          300: "#c596ff",
          400: "#b379ff",
          500: "#9651f0",
          600: "#742dcf",
        },
        copper: {
          200: "#f6e8cb",
          300: "#f0dbb0",
          400: "#d8b67b",
          500: "#bd9655",
          600: "#8d6d39",
        },
      },
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        accent: ["var(--font-unbounded)", "var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(179,121,255,0.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(179,121,255,0.11) 1px, transparent 1px)",
        "aurora":
          "radial-gradient(circle at 11% 18%, rgba(149,81,240,0.29), transparent 35%), radial-gradient(circle at 90% 8%, rgba(216,182,123,0.24), transparent 35%), radial-gradient(circle at 50% 90%, rgba(162,96,255,0.11), transparent 30%)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite alternate",
        "reveal-letter": "reveal-letter 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 18px rgba(179, 121, 255, 0.32)" },
          "100%": { boxShadow: "0 0 40px rgba(216, 182, 123, 0.46)" },
        },
        "reveal-letter": {
          "0%": {
            opacity: "0",
            transform: "translateY(1.2em) rotate(7deg)",
            filter: "blur(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) rotate(0deg)",
            filter: "blur(0px)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
