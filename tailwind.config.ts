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
          300: "#78f7ff",
          400: "#4de4ff",
          500: "#00c6ff",
          600: "#008eb8",
        },
        copper: {
          300: "#ffd4a5",
          400: "#ffb86a",
          500: "#f2862d",
          600: "#b95a11",
        },
      },
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
        display: ["var(--font-unbounded)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(0,198,255,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,198,255,0.09) 1px, transparent 1px)",
        "aurora":
          "radial-gradient(circle at 10% 20%, rgba(0,198,255,0.28), transparent 35%), radial-gradient(circle at 90% 5%, rgba(242,134,45,0.3), transparent 35%), radial-gradient(circle at 50% 90%, rgba(79,205,255,0.12), transparent 30%)",
      },
      animation: {
        "float": "float 8s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
        "reveal-letter": "reveal-letter 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 18px rgba(0, 198, 255, 0.35)" },
          "100%": { boxShadow: "0 0 38px rgba(242, 134, 45, 0.5)" },
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
