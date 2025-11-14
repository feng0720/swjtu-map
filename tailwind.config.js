/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

