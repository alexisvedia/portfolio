import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTransition, a } from '@react-spring/web';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Tooltip from '../../components/Tooltip/Tooltip';
import { useTheme } from '../../context/ThemeContext';

import './MasonryFusion.css';

export interface MasonryItem {
  id: string | number;
  height: number;
  image: string;
  video?: string;
  title?: { es: string; en: string };
  description?: { es: string; en: string };
  documentLinks?: Array<{ name: string; url: string }>;
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
  height: number;
}

interface MasonryProps {
  data: MasonryItem[];
}

// Estilos (ModalInfoTitle, DocumentLinksContainer, etc.) se mantienen igual por ahora
// ... (copiar los componentes styled de Masonry.tsx aquí) ...

// Nuevo componente estilizado para el título del modal
const ModalInfoTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1.2rem;
  color: ${({ theme }) =>
    theme.isDark || theme.themeMode === 'dark' ? '#E0E0E0' : '#333333'};
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

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

const MasonryFusion: React.FC<MasonryProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith('en') ? 'en' : 'es';
  const { theme } = useTheme();
  const isDark = theme.isDark;
  const [columns, setColumns] = useState<number>(2);
  const [selectedContent, setSelectedContent] = useState<MasonryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    const updateColumns = () => {
      if (window.matchMedia('(min-width: 1500px)').matches) {
        setColumns(5);
      } else if (window.matchMedia('(min-width: 1000px)').matches) {
        setColumns(4);
      } else if (window.matchMedia('(min-width: 600px)').matches) {
        setColumns(3);
      } else {
        setColumns(1);
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
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [heights, gridItems] = useMemo<[number[], GridItem[]]>(() => {
    let newHeights = new Array(columns).fill(0);
    const newGridItems = data.map(child => {
      const column = newHeights.indexOf(Math.min(...newHeights));
      const itemHeight = child.height / 2;
      const x = (width / columns) * column;
      const y = (newHeights[column] += itemHeight) - itemHeight;
      return {
        ...child,
        x,
        y,
        width: width / columns,
        height: itemHeight,
      };
    });
    return [newHeights, newGridItems];
  }, [columns, data, width]);

  const transitions = useTransition(gridItems, {
    keys: item => item.id,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  const handleItemClick = (item: MasonryItem, index: number) => {
    setSelectedContent(item);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedContent(null);
    setCurrentIndex(null);
  };

  const goToNext = () => {
    if (currentIndex === null || currentIndex >= data.length - 1) return;
    setCurrentIndex(prevIndex => (prevIndex !== null ? prevIndex + 1 : null));
    setSelectedContent(data[currentIndex !== null ? currentIndex + 1 : 0]);
  };

  const goToPrevious = () => {
    if (currentIndex === null || currentIndex <= 0) return;
    setCurrentIndex(prevIndex => (prevIndex !== null ? prevIndex - 1 : null));
    setSelectedContent(data[currentIndex !== null ? currentIndex - 1 : 0]);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedContent) return;
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowRight') goToNext();
      if (event.key === 'ArrowLeft') goToPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedContent, currentIndex, data]); // Asegúrate de incluir todas las dependencias

  const handleShowTooltip = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setTooltipVisible(true);
  };

  const handleHideTooltip = () => {
    setTooltipVisible(false);
  };

  return (
    <div ref={ref} className="masonry-grid" style={{ height: Math.max(...heights) }}>
      {transitions((styleProps) => {
        // Casting explícito para acceder a las propiedades
        const typedStyle = styleProps as any;
        const item = gridItems.find(item => 
          item.x === typedStyle.x && 
          item.y === typedStyle.y);
        
        return item ? (
          <a.div
            className="masonry-item"
            style={styleProps as any}
            onClick={() => handleItemClick(item, gridItems.findIndex(gi => gi.id === item.id))}
          >
            <img
              src={item.image}
              alt={item.title ? item.title[language] : 'Project image'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          </a.div>
        ) : null;
      })}
      {selectedContent &&
        ReactDOM.createPortal(
          <div
            className={`modal-overlay ${isMobile ? 'mobile' : ''} ${isDark ? 'dark-mode' : ''}`}
            onClick={closeModal}
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchMove={isMobile ? handleTouchMove : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
          >
            <div className="modal-content-wrapper" onClick={e => e.stopPropagation()}>
              <button
                className="modal-close-button"
                onClick={closeModal}
                aria-label={t('masonry.closeModalAria', 'Cerrar modal')}
              >
                &times;
              </button>

              <div className="modal-media-area">
                {selectedContent.video ? (
                  <video
                    key={selectedContent.id}
                    src={selectedContent.video}
                    poster={selectedContent.image}
                    controls
                    autoPlay
                    loop
                    playsInline
                    style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain' }}
                  />
                ) : (
                  <img
                    ref={imageRef}
                    src={selectedContent.image}
                    alt={selectedContent.title ? selectedContent.title[language] : 'Project image'}
                    style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain' }}
                    onLoad={() => {
                      if (imageRef.current) {
                        // const aspectRatio = imageRef.current.naturalWidth / imageRef.current.naturalHeight;
                        // Lógica adicional basada en aspect ratio si es necesaria
                      }
                    }}
                  />
                )}
              </div>
              <div className="modal-info-area">
                {selectedContent.title && (
                  <ModalInfoTitle>
                    {selectedContent.title[language]}
                  </ModalInfoTitle>
                )}
                {selectedContent.description && (
                  <p className="modal-description">{selectedContent.description[language]}</p>
                )}

                {selectedContent.documentLinks &&
                  selectedContent.documentLinks.length > 0 && (
                    <DocumentLinksContainer>
                      <DocumentLinksTitle>
                        {t('masonry.documentsTitle', 'Documentos Relacionados')}
                      </DocumentLinksTitle>
                      <DocumentLinksList>
                        {selectedContent.documentLinks.map(link => (
                          <DocumentLinkItem key={link.name}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onMouseMove={handleShowTooltip}
                              onMouseLeave={handleHideTooltip}
                            >
                              <svg
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
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                              {link.name}
                            </a>
                          </DocumentLinkItem>
                        ))}
                      </DocumentLinksList>
                    </DocumentLinksContainer>
                  )}

                {selectedContent.actionButton && (
                  <AcrylicButton
                    href={selectedContent.actionButton.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    $isDark={isDark}
                    onMouseMove={handleShowTooltip}
                    onMouseLeave={handleHideTooltip}
                  >
                    {i18n.language === 'es'
                      ? selectedContent.actionButton.labelES
                      : selectedContent.actionButton.labelEN}
                  </AcrylicButton>
                )}
              </div>

              {/* Navegación del modal */}
              {data.length > 1 && (
                <>
                  <button
                    className="modal-nav-button prev"
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    aria-label={t(
                      'masonry.previousItemAria',
                      'Elemento anterior',
                    )}
                  >
                    &#10094;
                  </button>
                  <button
                    className="modal-nav-button next"
                    onClick={goToNext}
                    disabled={currentIndex === data.length - 1}
                    aria-label={t('masonry.nextItemAria', 'Siguiente elemento')}
                  >
                    &#10095;
                  </button>
                </>
              )}
            </div>
            {tooltipVisible && (
              <Tooltip
                text={t(
                  selectedContent?.actionButton
                    ? 'tooltip.viewProjectDetails'
                    : 'tooltip.viewDocument',
                  'Ver detalles'
                )}
                position={tooltipPosition}
                isVisible={tooltipVisible}
              />
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default MasonryFusion; 