/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      fontFamily: {
        archivo: ['Archivo', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      content: {
        checkMark: 'url("/img/checkmark.svg")',
      },
    },
  },
  plugins: [],
};
