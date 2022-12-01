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
      'min-title': '1.875rem',
      'min-para': '.5rem',
      'sm': '0.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    },
    extend: {
      colors: {
        'green-design': '#008137',
      },
    },
    screens: {
      'sm': '576px',
      // => @media (min-width: 576px) { ... }

      'md': '992px',
      // => @media (min-width: 960px) { ... }

      'lg': '1280px',
      // => @media (min-width: 1440px) { ... }
    },
  },
  plugins: [],
}
