import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import './FlowingMenu.css';

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

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  text,
  image,
  _color = '#fff',
  _description = '',
}) => {
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
        <img
          src={image}
          alt={text}
          className="company-logo"
          style={{
            filter: isDarkMode ? 'brightness(0) invert(1)' : 'brightness(0)',
          }}
        />
      </a>
    </div>
  );
};

export default FlowingMenu;
