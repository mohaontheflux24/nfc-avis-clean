import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14141c",
          900: "#0c0c12",
          800: "#14141c",
          700: "#1e1e29",
          600: "#2a2a38",
        },
        paper: {
          DEFAULT: "#faf8f4",
          100: "#ffffff",
          200: "#f4f1ea",
        },
        brass: {
          DEFAULT: "#c9a15a",
          50: "#f8f1e3",
          100: "#eeddb8",
          300: "#dcbc7f",
          500: "#c9a15a",
          600: "#a9803e",
          700: "#8a6631",
        },
        success: "#2f7a4d",
        danger: "#c1483b",
        slate: {
          450: "#7a7a86",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(20, 20, 28, 0.08)",
        card: "0 2px 12px rgba(20, 20, 28, 0.06)",
        glow: "0 0 40px rgba(201, 161, 90, 0.35)",
      },
      keyframes: {
        "star-pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        confetti: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(120px) rotate(240deg)", opacity: "0" },
        },
      },
      animation: {
        "star-pop": "star-pop 0.4s ease",
        "fade-up": "fade-up 0.5s ease both",
        confetti: "confetti 1.1s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
