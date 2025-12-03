/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            colors: {
                luxury: {
                    black: '#09090b', // zinc-950
                    zinc: '#18181b',  // zinc-900
                    plate: '#27272a', // zinc-800
                },
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
                'fade-in': 'fade-in 0.8s ease-out forwards',
                'slide-up-fade': 'slide-up-fade 0.8s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'slide-up-fade': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
