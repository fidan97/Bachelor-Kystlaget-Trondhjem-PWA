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
      textColor: {
        primary: colors.slate,
        secondary: colors.lime,
        teritary: colors.pink,
        disabled: colors.gray[400],
        success: colors.green,
      },

      maxWidth: {
        calc: "calc(100% - 8rem)",
      },
    },
  },
  plugins: [],
};
