/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Admin-panel-only tokens — these don't affect your frontend since
        // your frontend components use Tailwind's default palette + arbitrary
        // values (e.g. bg-[#1f2326]), not these named tokens.
        primary: {
          DEFAULT: "#ef4444",
          50:  "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        surface: {
          DEFAULT: "#ffffff",
          soft:    "#f5f7fb",
          muted:   "#e9eef7",
        },
        border: { DEFAULT: "#e6eaf2" },
        ink: {
          900: "#0f1729",
          700: "#36405a",
          500: "#5b6679",
          400: "#8993a8",
        },
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,41,0.04), 0 4px 12px rgba(15,23,41,0.05)",
        lift: "0 8px 24px rgba(15,23,41,0.10)",
      },
    },
  },
  plugins: [],
}