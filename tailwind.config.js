/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brasfortal: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#94bcdd',
          400: '#5f9bcc',
          500: '#397ebd',
          600: '#28639f',
          700: '#215082',
          800: '#1e446c',
          900: '#1d3a5a',
          950: '#13253b',
        }
      }
    },
  },
  plugins: [],
};
