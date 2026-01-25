export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#050b18",
        panel: "#0b1226",
        border: "rgba(255,255,255,0.1)",
        text: "#e5e7eb",
        accent: "#22d3ee",
      },
      boxShadow: {
        glass: "0 0 20px rgba(34,211,238,0.08)",
      },
    },
  },
  plugins: [],
};
