/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        canvas: "#F7F5F0",
        accent: "#F45D35",
        "accent-soft": "#FFF0EA",
        forest: "#23483D",
        sand: "#E9D7B7",
        muted: "#73716B",
        border: "#E6E2DA",
        surface: "#FFFFFF",
      },
      boxShadow: { soft: "0 12px 40px rgba(37,31,26,.08)" },
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
