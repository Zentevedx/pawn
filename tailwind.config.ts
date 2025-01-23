/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Asegúrate de incluir las rutas correctas
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['Lilita One', 'sans-serif'], // Fuente para los títulos
        body: ['Madimi One', 'sans-serif'], // Fuente para el contenido
      },
    },
  },
  plugins: [],
};
