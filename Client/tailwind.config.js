/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      transitionProperty: {
        'bg-color': 'background-color'
      }
    },
  },
  plugins: [],
}

