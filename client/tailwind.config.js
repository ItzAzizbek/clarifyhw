/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warmWhite: '#faf9f6',
        charcoal: '#333333',
        amberAccent: '#f59e0b', // Tailwind amber-500
        yellowAccent: '#facc15', // Tailwind yellow-400
      },
      fontFamily: {
        serif: ['Lora', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

