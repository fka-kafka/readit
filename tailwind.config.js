/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/**/*.{js,ts}', './index.html', './public/*.html'],
	theme: {
		extend: {
			colors: {
				redditOrange: '#ff4400',
			},
		},
	},
	plugins: [require('daisyui')],
};
