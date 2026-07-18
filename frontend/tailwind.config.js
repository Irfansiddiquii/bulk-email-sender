/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#667eea',
					dark: '#5a67d8',
					light: '#7f9cf5'
				},
				secondary: {
					DEFAULT: '#764ba2',
					dark: '#6b46c1',
					light: '#9f7aea'
				}
			}
		}
	},
	plugins: []
};
