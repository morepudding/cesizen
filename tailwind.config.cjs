/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Tu pourras utiliser "dark:" dans tes classes CSS
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#009E4F",
        secondary: "#F7D94C",
        accent: "#3B82F6",
        background: "#F5F7FA",
        darkBackground: "#1E1E1E",
        foreground: "#222222",
        card: "#FFFFFF",
        darkCard: "#2D2D2D",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        header: "0 2px 10px rgba(0, 0, 0, 0.1)",
        card: "0 4px 10px rgba(0, 0, 0, 0.1)",
      },
      transitionProperty: {
        "color-bg": "color, background-color",
        "transform-opacity": "transform, opacity",
      },
      keyframes: {
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInDown: "fadeInDown 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};