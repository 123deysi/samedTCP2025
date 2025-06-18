/** @type {import('tailwindcss').Config} */
module.exports = {
  
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4A3AFF",
      },
    },
    screens: {
      sm: '640px',
      'custom': {'max': '720px'},
    },
  },
  plugins: [],
}

