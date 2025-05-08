import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

interface PageTransitionProps {
  children: ReactNode;
}

const PageContainer = styled(motion.div)`
  position: absolute;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* align-items: center; */ /* Eliminado para permitir ancho completo */
  overflow-y: auto;
`;

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <PageContainer
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.5,
        }}
      >
        {children}
      </PageContainer>
    </AnimatePresence>
  );
};

export default PageTransition;
