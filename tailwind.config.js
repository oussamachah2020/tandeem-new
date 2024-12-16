/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                primary: ['var(--font-primary)'],
            },
            colors:{
                primary: '#1746A2',
                secondary: '#FF731D'
            }
        },
    },
    plugins: [],
}
