/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{html,js}", "./src/**/**/*.{html,js}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '24px',
        md: '12px',
      },
    },
    extend: {
      colors: {
        primary: "#301E5F",
        secondary: "#6A33FF",
      },
    },
    fontFamily: {
      sans: ["Noto Sans TC", "sans-serif"],
    },
    screens: {
      md: "768px",
      lg: "992px",
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          maxWidth: "100%",
          "@screen md": {
            maxWidth: "768px",
          },
          "@screen lg": {
            maxWidth: "1110px",
          },
        },
      });
    },
  ],
};
