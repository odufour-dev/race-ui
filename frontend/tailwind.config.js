/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Inclut tous les fichiers JS, JSX, TS, TSX dans le dossier src
    "./public/index.html"         // Inclut le fichier HTML principal
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui") // Si vous utilisez daisyUI
  ],
}