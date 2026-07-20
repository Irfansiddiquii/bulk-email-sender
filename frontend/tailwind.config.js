/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Geist', 'Inter', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif']
			},
			colors: {
				primary: {
					DEFAULT: '#6366f1', // Refined modern Indigo
					dark: '#4f46e5',
					light: '#818cf8'
				},
				secondary: {
					DEFAULT: '#a855f7', // Refined Purple/Violet
					dark: '#9333ea',
					light: '#c084fc'
				}
			},
			boxShadow: {
				'premium': '0 2px 8px -1px rgba(0, 0, 0, 0.02), 0 4px 20px -2px rgba(0, 0, 0, 0.04)',
				'premium-hover': '0 10px 30px -5px rgba(99, 102, 241, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
				'inset-white': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
				'soft': '0 2px 12px 0 rgba(0, 0, 0, 0.03)'
			}
		}
	},
	plugins: []
};
