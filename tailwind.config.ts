/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        modak: ["Modak", "cursive"],
        zain: ["Zain", "sans-serif"],
      },
      colors: {
        background: "#FEF3E2",
        primary: "#F3C623",
        secondary: "#FFB22C",
        accent: "#FA812F",
      },
    },
  },
  plugins: [],
};
