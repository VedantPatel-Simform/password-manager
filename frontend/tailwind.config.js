// tailwind.config.js
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}", // Ensures Tailwind scans all your Angular templates and components
  ],
  theme: {
    extend: {
      colors: {
        "federal-blue": "#03045e",
        "honolulu-blue": "#0077b6",
        "pacific-cyan": "#00b4d8",
        "non-photo-blue": "#90e0ef",
        "light-cyan": "#caf0f8",
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(#03045e, #0077b6, #00b4d8, #90e0ef, #caf0f8)",
        "gradient-conic":
          "conic-gradient(from 180deg, #03045e, #0077b6, #00b4d8, #90e0ef, #caf0f8)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s ease-out both",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "inner-soft": "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
