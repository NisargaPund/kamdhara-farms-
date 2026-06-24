/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F5EFE4",
        "dark-brown": "#3E2B1F",
        "medium-brown": "#8B6A4E",
        gold: "#C8A76A",
        "gold-dark": "#A88B4A",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
