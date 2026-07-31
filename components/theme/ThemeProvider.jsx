"use client";
// components/theme/ThemeProvider.jsx
// Lightweight light/dark theme context for the PUBLIC site only (the admin
// panel has its own separate layout/styling and is untouched by this).
//
// How it avoids a flash of the wrong theme on load: layout.js uses
// next/script with strategy="beforeInteractive" (see THEME_INIT_SCRIPT
// below) to run a small script in <head> before hydration, setting the
// `dark` class on <html> synchronously by reading the same localStorage
// key this provider uses. This component then just picks up whatever
// class is already there on mount and keeps it in sync going forward --
// it does not need to (and should not) re-decide the theme on mount, since
// that would cause a flash itself.
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "futurism-theme"; // "light" | "dark"
const ThemeContext = createContext({ theme: "light", toggleTheme: () => {}, setTheme: () => {} });

export function ThemeProvider({ children }) {
  // Read the class the anti-flash script already applied, so this state
  // starts in sync with the DOM instead of defaulting to "light" and
  // causing a visible flip on mount.
  const [theme, setThemeState] = useState(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  const applyTheme = useCallback((next) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage can throw in private-browsing/blocked-storage
      // situations -- theme just won't persist across reloads, which is a
      // fine degradation rather than a crash.
    }
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme, applyTheme]);

  const setTheme = useCallback((next) => applyTheme(next), [applyTheme]);

  // Keep theme in sync if changed in another tab.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
        setThemeState(e.newValue);
        document.documentElement.classList.toggle("dark", e.newValue === "dark");
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Exported so layout.js can inline this exact script in <head> -- keeping
// the source in one place instead of duplicating the logic as a string.
export const THEME_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;
