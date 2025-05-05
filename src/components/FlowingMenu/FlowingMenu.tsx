import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import "./FlowingMenu.css";

interface MenuItemProps {
  link: string;
  text: string;
  image: string;
  color?: string;
  description?: string;
}

interface FlowingMenuProps {
  items?: MenuItemProps[];
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = [] }) => {
  const { themeMode } = useTheme();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  
  const toggleExpand = (idx: number) => {
    setExpandedItem(expandedItem === idx ? null : idx);
  };
  
  return (
    <div className="menu-wrap" data-theme={themeMode}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem 
            key={idx} 
            {...item} 
            isExpanded={expandedItem === idx}
            onClick={() => toggleExpand(idx)}
          />
        ))}
      </nav>
    </div>
  );
};

interface MenuItemExtendedProps extends MenuItemProps {
  isExpanded: boolean;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemExtendedProps> = ({ 
  link, 
  text, 
  image, 
  color = "#fff", 
  description = "",
  isExpanded, 
  onClick 
}) => {
  const { themeMode } = useTheme();
  const isDarkMode = themeMode === 'dark';
  
  const itemRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={`menu__item ${isExpanded ? 'expanded' : ''}`} ref={itemRef}>
      <a
        className="menu__item-link"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        href={link}
      >
        <img 
          src={image} 
          alt={text} 
          className="company-logo" 
          style={{ 
            filter: isDarkMode ? 'brightness(0) invert(1)' : 'brightness(0)'
          }} 
        />
      </a>
      
      {isExpanded && (
        <div className="company-details" style={{ backgroundColor: color + '22', borderTop: `3px solid ${color}` }}>
          <h3>{text}</h3>
          <p>{description}</p>
          <div className="company-actions">
            <button className="company-button" style={{ backgroundColor: color }}>
              Ver más
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowingMenu; 