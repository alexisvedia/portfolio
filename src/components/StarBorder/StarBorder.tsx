import React from "react";
import "./StarBorder.css";
import { useTheme } from "../../context/ThemeContext";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties['animationDuration'];
  }

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "button";
  const { themeMode } = useTheme();
  const isDarkMode = themeMode === 'dark';

  // Determinar el color del borde según el tema
  const borderColor = isDarkMode ? color : '#333'; // Usa el color prop en dark, #333 en light

  return (
    <Component 
      className={`star-border-container ${className} ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${borderColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${borderColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className="inner-content">{children}</div>
    </Component>
  );
};

export default StarBorder; 