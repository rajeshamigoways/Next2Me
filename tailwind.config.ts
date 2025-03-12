import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // 👈 Enable dark mode with class
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cardBg: "var(--card-bg)", // Custom card background color for dark mode
        cardForeground: "var(--card-foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
