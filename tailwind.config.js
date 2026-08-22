/** @type {import('tailwindcss').Config} */
export default { content: ['./index.html','./src/**/*.{js,jsx}'], theme: { extend: { colors: { ink:'#1d1d1f', canvas:'#f7f5f2', accent:'#f2683a' }, boxShadow:{soft:'0 12px 40px rgba(37,31,26,.08)'}, fontFamily:{sans:['Inter','ui-sans-serif','system-ui','sans-serif']} } }, plugins: [] }
