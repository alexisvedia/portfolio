const baseTheme = {
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    heading:
      "'Morganite', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    morganite: "'Morganite', sans-serif",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "4rem",
    "7xl": "5rem",
    "8xl": "6rem",
  },
  space: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "4rem",
    "3xl": "8rem",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: "#0070f3",
    secondary: "#1c1c1e",
    background: "#1D1F23",
    text: "#ffffff",
    accent: "#7928ca",
    cardBackground: "#252830",
    inputBg: "#2a2e36",
    border: "#3a3f4b",
    success: "#2ecc71",
    error: "#e74c3c",
  },
  isDark: true,
};

export const lightTheme = {
  ...baseTheme,
  colors: {
    primary: "#0070f3",
    secondary: "#f5f5f7",
    background: "#ffffff",
    text: "#1D1F23",
    accent: "#7928ca",
    cardBackground: "#f8f9fa",
    inputBg: "#f2f3f5",
    border: "#e1e4e8",
    success: "#2ecc71",
    error: "#e74c3c",
  },
  isDark: false,
};

// Por compatibilidad con código existente, exportamos el tema oscuro como predeterminado
export const theme = darkTheme;

export type Theme = typeof darkTheme;

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
