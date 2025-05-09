import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext'; // Ajusta la ruta si es necesario
import React from 'react'; // Importar React para React.CSSProperties

interface StandardSectionTitleProps {
  children: React.ReactNode;
  className?: string; // Para permitir clases adicionales si es necesario
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>; // Para cambiar el tag HTML (h1, h2, etc.)
  style?: React.CSSProperties; // Añadir style prop
}

const Title = styled.h2` // Por defecto es h2, pero se puede cambiar con la prop 'as'
  font-family: 'NHaasGroteskTXPro-55Rg', 'Inter', sans-serif;
  font-weight: 900;
  font-size:1.6rem; /* Reducido desde 3rem */
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  line-height: 0.9;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem; /* Reducido desde 2.5rem */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.8rem; /* Reducido desde 2rem */
  }
`;

const StandardSectionTitle: React.FC<StandardSectionTitleProps> = ({ children, className, as, style }) => {
  // El hook useTheme() aquí es para asegurar que el componente se re-renderice si el tema cambia,
  // aunque el color ya se obtiene del theme prop en styled-components.
  // Si tus styled-components ya están configurados con ThemeProvider globalmente,
  // este hook aquí podría no ser estrictamente necesario solo para el color.
  const { themeMode } = useTheme(); 

  return (
    <Title className={className} as={as} style={style} $themeMode={themeMode}>
      {children}
    </Title>
  );
};

export default StandardSectionTitle; 