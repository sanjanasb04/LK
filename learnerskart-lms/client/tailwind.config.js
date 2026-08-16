/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a3d91', // Primary Blue
          dark: '#062c6b',
          light: '#1e5bbd'
        },
        accent: {
          DEFAULT: '#f97316', // Accent Orange
          dark: '#c2410c',
          light: '#fdba74'
        },
        highlight: {
          DEFAULT: '#0ea5e9', // Teal Highlight
          dark: '#0369a1',
          light: '#7dd3fc'
        },
        success: {
          DEFAULT: '#22c55e', // Success Green
          dark: '#15803d',
          light: '#86efac'
        },
        gamify: {
          DEFAULT: '#8b5cf6', // Purple Gamify
          dark: '#6d28d9',
          light: '#c084fc'
        },
        bglight: '#f0f5ff', // BG Light
        darksidebar: '#0f172a', // Dark Sidebar
        cardbg: '#ffffff', // Card BG
        customborder: '#e2e8f0' // Border
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'panel': '1rem', // rounded-2xl
        'card': '0.75rem', // rounded-xl
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
      }
    },
  },
  plugins: [],
}
