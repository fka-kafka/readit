import daisyui from 'daisyui'
export default {
	content: ['./src/**/**/*.{js,ts}', './index.html', './src/**/**/*.html'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				redditOrange: '#ff4400',
			},
			fontFamily: {
			 lato: ['"Lato"', 'sans-serif'],
			 allura: ['"Allura"', 'serif'],
			 montserrat: ['"Montserrat"', 'serif']
			}
		},
	},
	plugins: [daisyui],
	daisyui: {
    style: false
  }
};
