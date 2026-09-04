/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#0A7A52',
        secondary: '#E89A2B',
        accent: '#075C3E',
        'text-primary': '#1F2A24',
        'text-secondary': '#4A5650',
        'text-tertiary': '#B4BCB8',
        'bg-light': '#F6F8F6',
        'card-bg': '#FFFFFF',
        'border-color': '#E3E7E4',
        'success': '#1A9E6B',
        'warning': '#E8910F',
        'error': '#E0343A',
        'info': '#2E6FE0',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

