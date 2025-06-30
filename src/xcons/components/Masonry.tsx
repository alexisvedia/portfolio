import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom'; // Importar ReactDOM para createPortal
import { useTransition, a } from '@react-spring/web';
import styled from 'styled-components'; // Importar solo styled
import { useTranslation } from 'react-i18next'; // Importar useTranslation
import Tooltip from '../../components/Tooltip/Tooltip'; // Importar el componente Tooltip

const SplineScene = lazy(() => import('../SplineScene')); // Importar SplineScene dinámicamente

import './Masonry.css';

export interface MasonryItem {
  id: string | number;
  height: number;
  image?: string; // Hacer opcional si es Spline
  type: 'image' | 'spline'; // Nuevo campo para el tipo de contenido
  splineSrc?: string; // Opcional, para la URL de la escena de Spline
  thumbnail?: string; // Imagen para mostrar en la cuadrícula para Spline
  title?: string; // Nuevo campo para el título
  description?: string; // Nuevo campo para la descripción
  documentLinks?: Array<{ name: string; url: string }>; // Nuevo campo para enlaces a documentos
  actionButton?: {
    url: string;
    labelES: string;
    labelEN: string;
  };
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  width: number;
  height: number; // This represents the scaled height
}

interface MasonryProps {
  data: MasonryItem[];
  themeMode?: 'light' | 'dark'; // Añadir themeMode a las props
  initialSelectedProject?: string | null; // Proyecto inicial a abrir
  onModalStateChange?: (isOpen: boolean, projectId?: string) => void; // Callback para cambios de estado del modal
}

// Nuevo componente estilizado para el título del modal
const ModalInfoTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-weight: 500; // Coincide con el font-weight de Role
  font-size: 1.2rem; // Ligeramente más grande para un título de modal, ajustable
  color: ${({ theme }) =>
    theme.isDark || theme.themeMode === 'dark' ? '#E0E0E0' : '#333333'}; // Ajustar color según tema
  margin-bottom: 0.75rem; // Espaciado inferior
  line-height: 1.3;
`;

// Nuevo componente para los enlaces a documentos
const DocumentLinksContainer = styled.div`
  margin-top: 1.5rem;
`;

const DocumentLinksTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  color: ${({ theme }) => (theme.isDark || theme.themeMode === 'dark' ? '#E0E0E0' : '#333333')};
  margin-bottom: 0.75rem;
`;

const DocumentLinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const DocumentLinkItem = styled.li`
  margin-bottom: 0.5rem;

  a {
    color: ${({ theme }) => (theme.isDark || theme.themeMode === 'dark' ? '#4DABF7' : '#0072CE')};
    text-decoration: none;
    display: flex;
    align-items: center;

    &:hover {
      text-decoration: underline;
    }

    svg {
      margin-right: 0.5rem;
    }
  }
`;

const AcrylicButton = styled.a<{ $isDark: boolean }>`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 7px 14px;
  border-radius: 100px;
  font-size: 0.92em;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  color: white;
  background-color: ${({ $isDark }) =>
    $isDark ? 'rgba(40, 40, 40, 0.6)' : 'rgba(60, 60, 60, 0.5)'};
  border: 1px solid
    ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.18)')};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
  z-index: 1020;
  box-shadow: none;
  border-width: 1px;
  border-style: solid;
  position: relative;
  overflow: hidden;
  outline: none;
  width: auto;
  max-width: 150px;
  min-width: 0;
  &:hover {
    background-color: ${({ $isDark }) =>
      $isDark ? 'rgba(50, 50, 50, 0.8)' : 'rgba(70, 70, 70, 0.7)'};
    transform: scale(1.03);
    box-shadow: none;
    text-decoration: none;
  }
`;

const Masonry: React.FC<MasonryProps> = ({ data, themeMode, initialSelectedProject, onModalStateChange }) => {
  const { t, i18n } = useTranslation(); // Hook de traducción
  const [columns, setColumns] = useState<number>(2);
  const [selectedContent, setSelectedContent] = useState<MasonryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  const isDark = themeMode === 'dark';

  // --- NUEVO: Detectar si es mobile ---
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- NUEVO: Swipe handlers para mobile ---
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex !== null && currentIndex < data.length - 1) {
          goToNext();
        } else if (diff < 0 && currentIndex !== null && currentIndex > 0) {
          goToPrevious();
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Efecto para abrir automáticamente el modal del proyecto inicial
  useEffect(() => {
    if (initialSelectedProject && data.length > 0) {
      const projectItem = data.find(item => 
        item.id.toString() === initialSelectedProject ||
        (item.title && item.title.toLowerCase().replace(/\s+/g, '').includes(initialSelectedProject.toLowerCase().replace(/\s+/g, '')))
      );
      
      if (projectItem) {
        const index = data.indexOf(projectItem);
        setSelectedContent(projectItem);
        setCurrentIndex(index);
        onModalStateChange?.(true, initialSelectedProject);
      }
    }
  }, [initialSelectedProject, data, onModalStateChange]);

  useEffect(() => {
    const updateColumns = () => {
      if (window.matchMedia('(min-width: 1500px)').matches) {
        setColumns(5);
      } else if (window.matchMedia('(min-width: 1000px)').matches) {
        setColumns(4);
      } else if (window.matchMedia('(min-width: 600px)').matches) {
        setColumns(3);
      } else {
        setColumns(1); // Breakpoint for mobile devices
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    handleResize(); // Set initial width
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [heights, gridItems] = useMemo<[number[], GridItem[]]>(() => {
    if (width === 0) { // Si el ancho no está listo, no calcular items.
      return [[], []];
    }
    let newHeights = new Array(columns).fill(0);
    const newGridItems = data.map(child => {
      const column = newHeights.indexOf(Math.min(...newHeights));
      const itemHeight = child.height / 2; // Usar la altura original para el cálculo de posición
      const x = (width / columns) * column;
      const y = (newHeights[column] += itemHeight) - itemHeight;
      return {
        ...child,
        x,
        y,
        width: width / columns,
        height: itemHeight, // Usar la altura original para el grid item
      };
    });
    return [newHeights, newGridItems];
  }, [columns, data, width]);

  const transitions = useTransition<
    GridItem,
    { x: number; y: number; width: number; height: number; opacity: number }
  >(gridItems, {
    keys: item => item.id,
    from: { opacity: 0 },
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    leave: { height: 0, opacity: 0 },
    config: { duration: 0 },
    trail: 0,
  });

  const handleItemClick = (item: MasonryItem, index: number) => {
    setSelectedContent(item);
    setCurrentIndex(index);
    onModalStateChange?.(true, item.id.toString());
  };

  const closeModal = () => {
    setSelectedContent(null);
    setCurrentIndex(null);
    onModalStateChange?.(false);
  };

  const goToNext = () => {
    if (currentIndex === null || currentIndex >= data.length - 1) return;
    const nextIndex = currentIndex + 1;
    setSelectedContent(data[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const goToPrevious = () => {
    if (currentIndex === null || currentIndex <= 0) return;
    const prevIndex = currentIndex - 1;
    setSelectedContent(data[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  // --- NUEVO: Navegación con teclado en el modal ---
  useEffect(() => {
    if (selectedContent === null || currentIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (currentIndex > 0) {
          goToPrevious();
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (currentIndex < data.length - 1) {
          goToNext();
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedContent, currentIndex, data.length]);

  const handleShowTooltip = (e: React.MouseEvent) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setTooltipVisible(true);
  };

  const handleHideTooltip = () => {
    setTooltipVisible(false);
  };

  const ModalContent = (
    <div className={`modal-overlay ${isDark ? 'dark-mode' : ''}`} onClick={closeModal}>
      {/* Tooltip global */}
      <Tooltip
        text={t('tooltip.viewOriginal')}
        isVisible={tooltipVisible}
        position={tooltipPosition}
      />

      <div className="modal-content-wrapper" onClick={e => e.stopPropagation()}>
        {data.length > 1 && !isMobile && (
          <>
            <button
              className="modal-nav-button prev"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              aria-label="Previous item"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: '28px', height: '28px' }}
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              className="modal-nav-button next"
              onClick={goToNext}
              disabled={currentIndex === data.length - 1}
              aria-label="Next item"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: '28px', height: '28px' }}
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </>
        )}

        <div
          className="modal-media-area"
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchMove={isMobile ? handleTouchMove : undefined}
          onTouchEnd={isMobile ? handleTouchEnd : undefined}
        >
          {selectedContent?.type === 'image' && selectedContent.image && (
            <div
              className="image-scroll-container"
              style={{
                width: `clamp(300px, 90vw, 1200px)`,
                height: `clamp(300px, 85vh, 1000px)`,
                overflow: 'auto',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                ref={imageRef}
                src={selectedContent.image}
                alt={selectedContent.title || 'Selected Image'}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                }}
                draggable="false"
              />
            </div>
          )}
          {selectedContent?.type === 'spline' && (
            <div className="spline-modal-container">
              <Suspense fallback={<div>Loading 3D...</div>}>
                <SplineScene />
              </Suspense>
            </div>
          )}
        </div>

        {(selectedContent?.title || selectedContent?.description) && (
          <div className="modal-info-area">
            {selectedContent.title && <ModalInfoTitle>{selectedContent.title}</ModalInfoTitle>}
            {selectedContent.description && <p>{selectedContent.description}</p>}

            {/* Botón acrílico opcional */}
            {selectedContent.actionButton && (
              <AcrylicButton
                href={selectedContent.actionButton.url}
                target="_blank"
                rel="noopener noreferrer"
                $isDark={isDark}
                onMouseEnter={undefined}
                onMouseLeave={undefined}
                style={{ textDecoration: 'none' }}
              >
                {i18n.language.startsWith('es')
                  ? selectedContent.actionButton.labelES
                  : selectedContent.actionButton.labelEN}
              </AcrylicButton>
            )}

            {selectedContent?.documentLinks && selectedContent.documentLinks.length > 0 && (
              <DocumentLinksContainer>
                <DocumentLinksTitle>
                  {t('documentLinksTitle', 'Defensa de la propuesta')}
                </DocumentLinksTitle>
                <DocumentLinksList>
                  {selectedContent.documentLinks.map((link, index) => (
                    <DocumentLinkItem key={`doc-link-${index}`}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                        {link.name}
                      </a>
                    </DocumentLinkItem>
                  ))}
                </DocumentLinksList>
              </DocumentLinksContainer>
            )}
          </div>
        )}

        <button className="modal-close-button" onClick={closeModal} aria-label="Close modal">
          &times;
        </button>

        {/* Botón para abrir imagen en nueva pestaña */}
        {selectedContent?.type === 'image' && selectedContent.image && (
          <button
            className="modal-open-original-button"
            onClick={() => window.open(selectedContent.image, '_blank', 'noopener,noreferrer')}
            onMouseEnter={handleShowTooltip}
            onMouseLeave={handleHideTooltip}
          >
            {t('viewOriginalButton', 'Ver Original')}
          </button>
        )}

        {data.length > 1 && !isMobile && (
          <div className="modal-thumbnail-strip">
            {data.map((thumbItem, index) => (
              <div
                key={`thumb-${thumbItem.id}`}
                className={`thumbnail-item ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleItemClick(thumbItem, index)}
                role="button"
                tabIndex={0}
                aria-label={`View item ${index + 1}${thumbItem.title ? ': ' + thumbItem.title : ''}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleItemClick(thumbItem, index);
                  }
                }}
              >
                <img
                  src={
                    thumbItem.type === 'image' && thumbItem.image
                      ? thumbItem.image
                      : thumbItem.thumbnail || 'https://via.placeholder.com/50?text=N/A'
                  }
                  alt={thumbItem.title || `Thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}
        {/* Dots solo en mobile */}
        {data.length > 1 && isMobile && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '12px 0 0 0',
              gap: 8,
            }}
          >
            {data.map((_, idx) => (
              <span
                key={`dot-${idx}`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: idx === currentIndex ? '#007bff' : '#bbb',
                  display: 'inline-block',
                  transition: 'background 0.2s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // --- NUEVO: Manejar clase global para overlays y scroll del body ---
  useEffect(() => {
    if (selectedContent) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [selectedContent]);

  return (
    <>
      <div ref={ref} className="masonry" style={{ height: Math.max(...heights, 0) }}>
        {transitions((style, item) => {
          const originalDataIndex = data.findIndex(d => d.id === item.id);
          return (
            <a.div
              key={item.id}
              style={style}
              onClick={() => {
                if (originalDataIndex !== -1) {
                  handleItemClick(item, originalDataIndex);
                }
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${item.type === 'image' ? item.image : item.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer',
                }}
              />
            </a.div>
          );
        })}
      </div>
      {selectedContent &&
        currentIndex !== null &&
        ReactDOM.createPortal(ModalContent, document.body)}
    </>
  );
};

export default Masonry;
