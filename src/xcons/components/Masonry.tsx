import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactDOM from 'react-dom'; // Importar ReactDOM para createPortal
import { useTransition, a } from "@react-spring/web";
import styled from 'styled-components'; // Importar styled
import SplineScene from '../SplineScene'; // Importar SplineScene

import "./Masonry.css";

interface MasonryItem {
  id: string | number;
  height: number;
  image?: string; // Hacer opcional si es Spline
  type: 'image' | 'spline'; // Nuevo campo para el tipo de contenido
  splineSrc?: string; // Opcional, para la URL de la escena de Spline
  thumbnail?: string; // Imagen para mostrar en la cuadrícula para Spline
  title?: string; // Nuevo campo para el título
  description?: string; // Nuevo campo para la descripción
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
}

// Nuevo componente estilizado para el título del modal
const ModalInfoTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-weight: 500; // Coincide con el font-weight de Role
  font-size: 1.2rem; // Ligeramente más grande para un título de modal, ajustable
  color: ${({ theme }) => (theme.isDark || theme.themeMode === 'dark' ? '#E0E0E0' : '#333333')}; // Ajustar color según tema
  margin-bottom: 0.75rem; // Espaciado inferior
  line-height: 1.3;
`;

const TARGET_ZOOM_LEVEL = 2.5;

const Masonry: React.FC<MasonryProps> = ({ data, themeMode }) => {
  const [columns, setColumns] = useState<number>(2);
  const [selectedContent, setSelectedContent] = useState<MasonryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [transformOriginValue, setTransformOriginValue] = useState<string>('50% 50%');
  const imageRef = useRef<HTMLImageElement>(null);

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const updateColumns = () => {
      if (window.matchMedia("(min-width: 1500px)").matches) {
        setColumns(5);
      } else if (window.matchMedia("(min-width: 1000px)").matches) {
        setColumns(4);
      } else if (window.matchMedia("(min-width: 600px)").matches) {
        setColumns(3);
      } else {
        setColumns(1); // Breakpoint for mobile devices
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [heights, gridItems] = useMemo<[number[], GridItem[]]>(() => {
    let newHeights = new Array(columns).fill(0);
    const newGridItems = data.map((child) => {
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
    keys: (item) => item.id,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  const resetZoomState = () => {
    setZoomLevel(1);
    setTransformOriginValue('50% 50%');
  }

  const handleItemClick = (item: MasonryItem, index: number) => {
    setSelectedContent(item);
    setCurrentIndex(index);
    resetZoomState();
  };

  const closeModal = () => {
    setSelectedContent(null);
    setCurrentIndex(null);
    resetZoomState();
  };

  const goToNext = () => {
    if (currentIndex === null || currentIndex >= data.length - 1) return;
    const nextIndex = currentIndex + 1;
    setSelectedContent(data[nextIndex]);
    setCurrentIndex(nextIndex);
    resetZoomState();
  };

  const goToPrevious = () => {
    if (currentIndex === null || currentIndex <= 0) return;
    const prevIndex = currentIndex - 1;
    setSelectedContent(data[prevIndex]);
    setCurrentIndex(prevIndex);
    resetZoomState();
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    if (!imageRef.current) return;

    if (zoomLevel === 1) {
      // Zoom In
      const imageElement = event.currentTarget;
      // const rect = imageElement.getBoundingClientRect(); // rect del elemento img
      
      // offsetX/Y son relativos al borde del elemento img.
      // Esto es lo que queremos para transform-origin si el elemento img en sí no tiene padding.
      const clickX = event.nativeEvent.offsetX;
      const clickY = event.nativeEvent.offsetY;

      const originXPercent = (clickX / imageElement.offsetWidth) * 100;
      const originYPercent = (clickY / imageElement.offsetHeight) * 100;
      
      setTransformOriginValue(`${originXPercent}% ${originYPercent}%`);
      setZoomLevel(TARGET_ZOOM_LEVEL);
    } else {
      // Zoom Out
      resetZoomState();
    }
  };

  const ModalContent = (
    <div className={`modal-overlay ${themeMode === 'dark' ? 'dark-mode' : ''}`} onClick={closeModal}>
      <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
        {data.length > 1 && (
          <>
            <button
              className="modal-nav-button prev"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              aria-label="Previous item"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '28px', height: '28px' }}><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button
              className="modal-nav-button next"
              onClick={goToNext}
              disabled={currentIndex === data.length - 1}
              aria-label="Next item"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '28px', height: '28px' }}><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
          </>
        )}

        <div className="modal-media-area">
          {selectedContent?.type === 'image' && selectedContent.image && (
            <>
              <img 
                ref={imageRef}
                src={selectedContent.image} 
                alt={selectedContent.title || 'Selected Image'} 
                style={{ 
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: transformOriginValue,
                  transition: 'transform 0.3s ease-out, transform-origin 0s linear',
                  cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in',
                  willChange: 'transform'
                }}
                onClick={handleImageClick}
                draggable="false"
              />
            </>
          )}
          {selectedContent?.type === 'spline' && (
            <div className="spline-modal-container">
              <SplineScene /> 
            </div>
          )}
        </div>

        {(selectedContent?.title || selectedContent?.description) && (
          <div className="modal-info-area">
            {selectedContent.title && <ModalInfoTitle>{selectedContent.title}</ModalInfoTitle>}
            {selectedContent.description && <p>{selectedContent.description}</p>}
          </div>
        )}

        <button className="modal-close-button" onClick={closeModal} aria-label="Close modal">&times;</button>

        {data.length > 1 && (
          <div className="modal-thumbnail-strip">
            {data.map((thumbItem, index) => (
              <div
                key={`thumb-${thumbItem.id}`}
                className={`thumbnail-item ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleItemClick(thumbItem, index)}
                role="button"
                tabIndex={0}
                aria-label={`View item ${index + 1}${thumbItem.title ? ': ' + thumbItem.title : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleItemClick(thumbItem, index);
                  }
                }}
              >
                <img
                  src={thumbItem.type === 'image' && thumbItem.image ? thumbItem.image : (thumbItem.thumbnail || 'https://via.placeholder.com/50?text=N/A')}
                  alt={thumbItem.title || `Thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

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
                  backgroundColor: "#ffffff",
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${item.type === 'image' ? item.image : item.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                }}
              />
            </a.div>
          );
        })}
      </div>
      {selectedContent && currentIndex !== null && ReactDOM.createPortal(
        ModalContent, 
        document.body
      )}
    </>
  );
};

export default Masonry; 