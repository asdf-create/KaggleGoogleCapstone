/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        surface: "#ffffff",
        surfaceSubtle: "#f1f5f9",
        surfaceBorder: "#e2e8f0",
        glassBg: "rgba(255, 255, 255, 0.75)",
        glassBorder: "rgba(255, 255, 255, 0.9)",
        brandBlue: "#2563eb",
        brandCyan: "#0891b2",
        brandPurple: "#7c3aed",
        brandEmerald: "#059669",
        textPrimary: "#0f172a",
        textSecondary: "#475569",
        textMuted: "#64748b",
      },
      boxShadow: {
        liquid: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        liquidGlow: "0 10px 30px -5px rgba(37, 99, 235, 0.15)",
      },
    },
  },
  plugins: [],
}
