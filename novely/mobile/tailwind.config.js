/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        regular: ['Inter-Regular'],
        semibold: ['Inter-SemiBold'],
        bold: ['Inter-Bold'],
      },
      colors: {
        background: '#09090b',
        surface: '#141416',
        card: '#18181b',
        primary: {
          DEFAULT: '#7c3aed',
          dark: '#6d28d9',
          light: '#a78bfa'
        },
        textPrimary: '#fafafa',
        textMuted: '#a1a1aa',
        border: '#27272a',
      },
    },
  },
  plugins: [],
};