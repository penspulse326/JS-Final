/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#301E5F",
        secondary: "#6A33FF",
      },
    },
  },
  plugins: [],
};
