"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

/**
 * ThemeProvider manages dark/light mode state.
 *
 * The initial theme is set by an inline <script> in layout.tsx (before React
 * hydrates) to avoid a flash of wrong theme. This provider then reads the
 * data-theme attribute to sync React state.
 */
export function ThemeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Sync React state with the data-theme attribute set by the inline script
  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) ?? "dark";
    setTheme(current);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch {
        // localStorage unavailable — silently ignore
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
}
