import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  // For now, let's mock role as Level 1 (Admin)
  let initialDarkMode = localStorage.getItem("darkMode");
  const [darkMode, setMode] = useState(initialDarkMode === "true");

  const setDarkMode = (mode) => {
    localStorage.setItem("darkMode", !darkMode);
    setMode(mode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
