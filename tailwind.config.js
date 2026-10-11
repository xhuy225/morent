/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Tắt preflight của Tailwind để không ghi đè style của Ant Design (nút primary bị mất màu)
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: '#3563E9',
        'primary-dark': '#264AC6',
        secondary: '#90A3BF',
        dark: '#1A202C',
        light: '#F6F7F9',
        danger: '#ED3F3F',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
