const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.slate,
        danger: colors.red,
        secondary: colors.lime,
        teritary: colors.pink,
      },
      backgroundColor: {
        primary_light: "#F6F7F9",
        primary_dark: "#1F3357",
        container_light: "#ffff",
        container_dark: "#2E4369",
        secondary: "#AAD922",
        teritary: "#D4009D",
      },
      textColor: {
        disabled: colors.gray[400],
        success: colors.green,
      },

      maxWidth: {
        calc: "calc(100% - 8rem)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
