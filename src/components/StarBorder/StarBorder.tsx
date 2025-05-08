import React, { useState } from "react";
import "./StarBorder.css";
import { useTheme } from "../../context/ThemeContext";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties['animationDuration'];
    hoverBorderColorLight?: string;
  }

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  children,
  hoverBorderColorLight = "#cccccc",
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "button";
  const { themeMode } = useTheme();
  const isDarkMode = themeMode === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  const getBorderStyle = () => {
    let borderColorToUse = isDarkMode ? color : '#333';
    if (!isDarkMode && isHovered) {
      borderColorToUse = hoverBorderColorLight;
    }
    return {
      background: `radial-gradient(circle, ${borderColorToUse}, transparent 10%) !important`,
      animationDuration: speed,
    };
  };

  return (
    <Component 
      className={`star-border-container ${className} ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={getBorderStyle()}
      ></div>
      <div
        className="border-gradient-top"
        style={getBorderStyle()}
      ></div>
      <div className="inner-content">{children}</div>
    </Component>
  );
};

export default StarBorder; 