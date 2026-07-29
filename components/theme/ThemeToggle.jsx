"use client";
// components/theme/ThemeToggle.jsx
// Floating light/dark toggle rendered by Header.jsx (see that file) so it
// appears once per page, regardless of which of the 7 header templates is
// active -- this component itself is never placed inside a template file.
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-5 right-5 z-50 h-11 w-11 rounded-full shadow-lg border
                 border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-800
                 text-gray-700 dark:text-gray-100
                 flex items-center justify-center
                 hover:scale-105 active:scale-95 transition-transform"
    >
      {isDark ? (
        // Sun icon (click to go light)
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // Moon icon (click to go dark)
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}
