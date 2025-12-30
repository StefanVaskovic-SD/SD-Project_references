/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Only black and white allowed
        black: '#000000',
        white: '#FFFFFF',
      },
      fontFamily: {
        sans: ['SuisseIntl', 'Inter', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
      },
    },
  },
  plugins: [],
}

