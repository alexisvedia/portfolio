import React from 'react';
import './ShinyText.css';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
    onClick?: () => void;
}

const ShinyText: React.FC<ShinyTextProps> = ({ 
    text, 
    disabled = false, 
    speed = 5, 
    className = '',
    onClick
}) => {
    const animationDuration = `${speed}s`;

    return (
        <div className={`shiny-text-container ${className}`} onClick={onClick}>
            <div className="background-circles">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
            </div>
            <div
                className={`shiny-text ${disabled ? 'disabled' : ''}`}
                style={{ animationDuration }}
            >
                {text}
            </div>
        </div>
    );
};

export default ShinyText; 