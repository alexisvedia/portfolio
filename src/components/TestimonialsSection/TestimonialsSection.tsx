import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useTheme } from '../../context/ThemeContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Placeholder images (replace with actual paths or logic)
const placeholderPerson = 'https://via.placeholder.com/80/cccccc/808080?text=Person';
const placeholderLogo = 'https://via.placeholder.com/100x40/eeeeee/909090?text=Logo';

// Actualizar estructura de datos
interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  personImage?: string; // opcional
  companyLogo?: string; // opcional
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    quote: "Trabajar con Alexis fue una experiencia transformadora. Su visión para el diseño y la funcionalidad es excepcional.",
    name: "Ana García",
    role: "CEO, Startup Creativa",
    personImage: placeholderPerson,
    companyLogo: placeholderLogo
  },
  {
    id: 2,
    quote: "La atención al detalle y la capacidad de Alexis para entender las necesidades del usuario son impresionantes. Altamente recomendado.",
    name: "Carlos Rodríguez",
    role: "Product Manager, Tech Solutions",
    personImage: placeholderPerson,
    companyLogo: placeholderLogo
  },
  {
    id: 3,
    quote: "Un profesional dedicado y proactivo. Siempre aporta soluciones innovadoras y eficientes. Un placer colaborar con él.",
    name: "Laura Fernández",
    role: "Lead Developer, Innovatech",
    personImage: placeholderPerson,
    companyLogo: placeholderLogo
  }
];

const Section = styled.section`
  padding: ${({ theme }) => theme.space.xl} 0;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.xl};
  letter-spacing: 0.1em;
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  max-width: 800px; 
  margin: 0 auto;
  padding-bottom: 50px; // Aumentar espacio para paginación

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: transparent;
  }

  .swiper-pagination-bullet {
    background-color: ${({ theme }) => theme.colors.text}99;
    opacity: 0.6;
    transition: opacity 0.3s, background-color 0.3s;
  }

  .swiper-pagination-bullet-active {
    background-color: ${({ theme }) => theme.colors.text}; // Blanco en dark, Negro en light
    opacity: 1;
  }

  .swiper-button-prev,
  .swiper-button-next {
    color: ${({ theme }) => theme.colors.text};
    transform: scale(0.7);
    &:after {
      font-size: 2rem;
    }
  }
`;

// Estilo Glass/Acrylic
const glassEffect = css<{ $isDark: boolean }>`
  background: ${({ $isDark }) => $isDark ? 'rgba(40, 40, 45, 0.6)' : 'rgba(245, 245, 250, 0.65)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ $isDark }) => $isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'};
`;

const TestimonialCard = styled.div<{ $isDark: boolean }>`
  padding: ${({ theme }) => theme.space.xl}; // Más padding
  border-radius: 20px; // Más redondeado
  max-width: 90%; 
  min-height: 280px; // Altura mínima para consistencia
  display: flex;
  flex-direction: column;
  justify-content: space-between; // Para espaciar contenido y logo
  text-align: left; // Alinear texto a la izquierda
  ${glassEffect} // Aplicar efecto glass
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const PersonImage = styled.img`
  width: 60px; // Tamaño reducido
  height: 60px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.space.md};
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const AuthorInfo = styled.div`
  text-align: left;
`;

const Quote = styled.blockquote`
  font-size: ${({ theme }) => theme.fontSizes.md}; // Ligeramente más pequeño
  font-style: italic;
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.text}dd; // Más opaco
  line-height: 1.6;
  quotes: "\201C" "\201D" "\2018" "\2019";
  flex-grow: 1; // Para que ocupe espacio disponible
  position: relative;
  padding-left: 2.5rem; // Espacio para la comilla grande

  &::before {
    content: open-quote;
    font-size: 4em; // Comilla más grande
    position: absolute;
    left: 0;
    top: -0.1em;
    line-height: 1;
    color: ${({ theme }) => theme.colors.primary}aa; // Usar color primario con transparencia
  }
`;

const Author = styled.p`
  font-weight: bold;
  margin: 0; // Quitar margen superior
  color: ${({ theme }) => theme.colors.text};
`;

const Role = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text}aa;
  margin: 0;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end; // Alinear logo a la derecha
  margin-top: ${({ theme }) => theme.space.md};
  opacity: 0.7;
`;

const CompanyLogo = styled.img`
  max-height: 30px; // Altura máxima del logo
  max-width: 100px;
  object-fit: contain;
`;

const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme(); // Obtener el modo del tema
  const isDark = themeMode === 'dark';

  return (
    <Section id="testimonials">
      <SectionTitle>{t('testimonialsTitle', 'Testimonios')}</SectionTitle>
      <StyledSwiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000, 
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false} 
        modules={[Autoplay, Pagination, Navigation]}
        loop={true}
      >
        {testimonialsData.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <TestimonialCard $isDark={isDark}>
              <div> {/* Wrapper para contenido superior */} 
                <CardHeader>
                  <PersonImage src={testimonial.personImage || placeholderPerson} alt={testimonial.name} />
                  <AuthorInfo>
                    <Author>{testimonial.name}</Author>
                    <Role>{testimonial.role}</Role>
                  </AuthorInfo>
                </CardHeader>
                <Quote>{testimonial.quote}</Quote>
              </div>
              <CardFooter>
                <CompanyLogo src={testimonial.companyLogo || placeholderLogo} alt={`${testimonial.name}'s company logo`} />
              </CardFooter>
            </TestimonialCard>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </Section>
  );
};

export default TestimonialsSection; 