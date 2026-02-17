/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				// Paleta minimalista elegante: preto + creme quente
				primary: {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#e5e5e5',
					300: '#d4d4d4',
					400: '#a3a3a3',
					500: '#171717', // Preto principal
					600: '#0a0a0a',
					700: '#000000',
					800: '#000000',
					900: '#000000',
				},
				// Creme quente (off-white)
				cream: {
					50: '#FFFCF9',
					100: '#FAF8F5', // Principal
					200: '#F5F2ED',
					300: '#EBE7E0',
					400: '#DDD8CF',
					500: '#CFC9BD',
					600: '#B8B2A4',
					700: '#9A9488',
					800: '#7A756B',
					900: '#5C584F',
				},
				// Secondary mantido como alias para cream
				secondary: {
					50: '#FFFCF9',
					100: '#FAF8F5',
					200: '#F5F2ED',
					300: '#EBE7E0',
					400: '#DDD8CF',
					500: '#FAF8F5',
					600: '#F5F2ED',
					700: '#EBE7E0',
					800: '#DDD8CF',
					900: '#CFC9BD',
				},
			},
			fontFamily: {
				script: ['Cormorant Garamond', 'serif'],
				sans: ['Nunito', 'sans-serif'],
			},
			animation: {
				'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
				'bounce-slow': 'bounce 2s infinite',
			},
			keyframes: {
				fadeInUp: {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)',
					},
				},
			},
		},
	},
	plugins: [],
};
