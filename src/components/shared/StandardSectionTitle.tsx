import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import React from 'react';

interface StandardSectionTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  style?: React.CSSProperties;
}

const Title = styled.h2`
  font-weight: 900;
  font-size:1.6rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  line-height: 0.9;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.8rem;
  }
`;

const StandardSectionTitle: React.FC<StandardSectionTitleProps> = ({ children, className, as, style }) => {

  const { themeMode } = useTheme(); 

  return (
    <Title className={className} as={as} style={style} $themeMode={themeMode}>
      {children}
    </Title>
  );
};

export default StandardSectionTitle;