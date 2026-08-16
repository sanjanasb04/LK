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
          DEFAULT: '#098ce9',
          light: '#3ba6ed',
          dark: '#0370cb',
        },
        accent: {
          DEFAULT: '#f6b40a',
          light: '#f9c646',
          dark: '#c99305',
        },
        lightbg: '#f3f6ff',
        darkfooter: '#273044',
        textdark: '#1c1c1b',
        textmuted: '#666666',
        success: '#28a745',
        customborder: '#e2e0db',
      },
      fontFamily: {
        sans: ['Urbanist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        }
      }
    },
  },
  plugins: [],
}
