/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF4FA3',
        secondary: '#38D6C4',
        accent: '#7CF3E6',
        dark: '#0F172A',
        'light-bg': '#F8FAFC',
      }
    },
  },
  plugins: [],
}