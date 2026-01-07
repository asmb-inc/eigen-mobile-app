/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        regular: ["SpaceGrotesk-Regular"],
        medium: ["SpaceGrotesk-Medium"],
        semibold: ["SpaceGrotesk-SemiBold"],
        bold: ["SpaceGrotesk-Bold"],
      },
    },
  },
  plugins: [],
};
