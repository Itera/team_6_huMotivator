import { createContext, ReactNode, useContext, useState } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeMap: Record<string, { background: string; color: string; button: string; buttonText: string; buttonSelected: string; buttonSelectedText: string }> = {
  military: {
    background: "#e6f4ea",
    color: "#14532d",
    button: "#14532d",
    buttonText: "#fff",
    buttonSelected: "#2ecc40",
    buttonSelectedText: "#fff"
  },
  psychologist: {
    background: "#f5f5dc",
    color: "#5c4326",
    button: "#bfa76f",
    buttonText: "#fff",
    buttonSelected: "#e0cfa9",
    buttonSelectedText: "#5c4326"
  },
  artist: {
    background: "#ffe4f0",
    color: "#a8327e",
    button: "#e75480",
    buttonText: "#fff",
    buttonSelected: "#ffb6d5",
    buttonSelectedText: "#a8327e"
  },
  default: {
    background: "#fff",
    color: "#222",
    button: "#e5e4e7",
    buttonText: "#222",
    buttonSelected: "#aa3bff",
    buttonSelectedText: "#fff"
  },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("default");
  const themeVars = themeMap[theme] || themeMap.default;
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {/* Provide themeVars via context for styled-components */}
      <ThemeVarsContext.Provider value={themeVars}>
        <div style={{ background: themeVars.background, color: themeVars.color, minHeight: "100vh", transition: 'background 0.3s, color 0.3s' }}>
          {children}
        </div>
      </ThemeVarsContext.Provider>
    </ThemeContext.Provider>
  );
};

// New context for themeVars
import { createContext as createSCContext, useContext as useSCContext } from "react";
export const ThemeVarsContext = createSCContext(themeMap.default);
export const useThemeVars = () => useSCContext(ThemeVarsContext);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
