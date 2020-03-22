module.exports = {
  important: true,
  theme: {
    extend: {
      boxShadow: {
        studentPrimary: '0 1px 5px 0 rgba(106, 127, 219, 1), 0 1px 2px 0 rgba(106, 127, 219, .6)',
      },
      maxHeight: {
        300: '300px',
      },
      maxWidth: {
        '1/2': '50%',
      }
    }
  },
  variants: {
    variants: {
      boxShadow: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
    }
  },
  plugins: [],
}
