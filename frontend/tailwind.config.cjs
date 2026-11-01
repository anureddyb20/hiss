/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0f24', // deep navy/ink
        accent: '#00796b', // teal accent
        vermilion: '#e63946', // optional small accent (not used yet)
      },
    },
  },
  plugins: [],
};
