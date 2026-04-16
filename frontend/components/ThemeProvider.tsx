import { createContext, ReactNode, useContext, useState } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themeMap: Record<string, { coachLabel: string; accentColor: string }> = {
  military:    { coachLabel: "Militærleder",       accentColor: "#c3f400" },
  psychologist:{ coachLabel: "Psykolog",            accentColor: "#c1fffe" },
  artist:      { coachLabel: "Spirituell Kunstner", accentColor: "#ff7cf5" },
  default:     { coachLabel: "Default",             accentColor: "#ff7cf5" },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("default");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeVarsContext = createContext(themeMap.default);
export const useThemeVars = () => useContext(ThemeVarsContext);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
