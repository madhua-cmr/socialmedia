/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container:{
      center:true,
      padding:'1rem',
      screens:{
        sm:'100%',
        md:'550px',
        lg:'620px',
      }
    },
    extend: {},
  },
  plugins: [],
}

