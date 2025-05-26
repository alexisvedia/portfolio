import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import './FlowingMenu.css';

interface MenuItemProps {
  link: string;
  text: string;
  image?: string;
  color?: string;
  description?: string;
}

interface FlowingMenuProps {
  items?: MenuItemProps[];
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = [] }) => {
  const { themeMode } = useTheme();

  return (
    <div className="menu-wrap" data-theme={themeMode}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ link, text, image, color }) => {
  const { themeMode } = useTheme();
  const isDarkMode = themeMode === 'dark';
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(link);
  };

  return (
    <div className="menu__item">
      <a className="menu__item-link" onClick={handleClick} href={link}>
        {image ? (
          <img
            src={image}
            alt={text}
            className="company-logo"
            style={{
              filter: isDarkMode ? 'brightness(0) invert(1)' : 'brightness(0)',
            }}
          />
        ) : (
          <div
            className="company-text"
            style={{
              color: isDarkMode ? '#ffffff' : color || '#000000',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {text}
          </div>
        )}
      </a>
    </div>
  );
};

export default FlowingMenu;
