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
        primary: '#E6F7F3',
        secondary: '#2DBBA1',
        accent: '#1F5E52',
        'text-primary': '#111827',
        'text-secondary': '#4B5563',
        'text-tertiary': '#9CA3AF',
        'bg-light': '#F6F8F7',
        'card-bg': '#FFFFFF',
        'border-color': '#E5E7EB',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'info': '#3B82F6',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

