/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'open-sans': ['"Open Sans"', 'sans-serif'],
      },
      colors: {
        'seth-yellow': '#ffd900', 
        'seth-hover': '#e6c200',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#666666', 
            fontFamily: '"Open Sans", sans-serif',
            h1: {
              fontFamily: '"Open Sans", sans-serif',
              fontWeight: '800',
              color: '#3a3a3a',
            },
            h2: {
              fontFamily: '"Open Sans", sans-serif',
              fontWeight: '800',
              color: '#3a3a3a',
            },
            h3: {
              fontFamily: '"Open Sans", sans-serif',
              fontWeight: '800',
              color: '#3a3a3a',
            },
            strong: {
              color: '#3a3a3a',
              fontWeight: '700',
            },
            a: {
              color: '#ffd900',
              textDecoration: 'none',
            },
            'a:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}