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
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          DEFAULT: '#2563EB',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          DEFAULT: '#0F172A',
          950: '#020617',
        },
        success: {
          DEFAULT: '#22C55E',
          600: '#16a34a',
        },
        warning: {
          DEFAULT: '#F59E0B',
          600: '#d97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          600: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}
