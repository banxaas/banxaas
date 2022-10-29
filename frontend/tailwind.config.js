module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontSize: {
      'title': '30px',
      'subtitle': '16px',
      'paragraphe': '18px',
      'link': '16px',
      'petit': '12px',
      'heading': '80px',
      'min-title': '1.5rem',
      'min-para': '.5rem'
    },
    extend: {
      colors: {
        'green-design': '#008137',
      },
    },
    screens: {
      'sm': '300px',
      // => @media (min-width: 576px) { ... }

      'md': '768px',
      // => @media (min-width: 960px) { ... }

      'lg': '1280px',
      // => @media (min-width: 1440px) { ... }
    },
  },
  plugins: [],
}
