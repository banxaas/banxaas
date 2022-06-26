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
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '1024px',
      // => @media (min-width: 1024px) { ... }

      'lg': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  },
  plugins: [],
}
