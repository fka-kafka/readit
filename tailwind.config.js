/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts}", "./index.html"],
  theme: {
    extend: {
      colors: {
        redditOrange: '#ff4400'
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
};
