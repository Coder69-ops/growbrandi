/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    800: '#1e293b',
                    900: '#0f172a',
                },
                emerald: {
                    400: '#34d399',
                    500: '#10b981',
                },
                blue: {
                    400: '#60a5fa',
                    500: '#3b82f6',
                },
                purple: {
                    400: '#c084fc',
                    500: '#a855f7',
                },
                cyan: {
                    500: '#06b6d4',
                },
            },
            animation: {
                'pulse-glow': 'pulse-glow 4s infinite ease-in-out',
                'float': 'float 6s ease-in-out infinite',
                'slide-in-up': 'slide-in-up 0.6s ease-out',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' },
                    '50%': { boxShadow: '0 0 35px rgba(59, 130, 246, 0.6)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'slide-in-up': {
                    from: { opacity: '0', transform: 'translateY(30px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
