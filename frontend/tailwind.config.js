/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        surface: "#111827",
        surfaceBorder: "#1f293d",
        brandBlue: "#3b82f6",
        brandCyan: "#06b6d4",
        brandPurple: "#8b5cf6",
        brandEmerald: "#10b981",
      },
    },
  },
  plugins: [],
}
