/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/preline/preline.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      transitionProperty: {
        'bg-color': 'background-color'
      },
      fontFamily:{
        'proxima-nova': ['Proxima Nova', 'sans-serif'],
      },
      objectFit: {
        'contain': 'object-fit-contain',
      },
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
}

