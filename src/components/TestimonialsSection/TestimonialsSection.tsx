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

// Importar imágenes de personas (asumiendo .png, ajustar si es necesario)
import jorgeImage from '../../assets/images/testimonials/Jorge.jpeg';
import mauroImage from '../../assets/images/testimonials/Mauro.jpeg';
import milenaImage from '../../assets/images/testimonials/Milena.jpeg';
import kodiImage from '../../assets/images/testimonials/Kodi.png';

// Importar logos de empresa desde la carpeta de proyectos
import xconsLogo from '../../assets/images/projects/XCONS.svg';
import fusionadsLogo from '../../assets/images/projects/Fusionads.svg';
import banditLogo from '../../assets/images/projects/Bandit.svg';

// Placeholder para logo (si es necesario)
// const placeholderLogo = 'https://via.placeholder.com/100x40/eeeeee/909090?text=Logo'; // Ya no se necesita por ahora

// Actualizar estructura de datos
interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  personImage: string; // Ahora requerido
  companyLogo: string; // Ahora requerido (usaremos placeholder si no hay)
}

// Actualizar datos con las nuevas personas, imágenes y logos
const testimonialsData: Testimonial[] = [
  {
    id: 1,
    quote: "testimonials.jorge", // Clave para i18next
    name: "Jorge Venzon",
    role: "CTO at XCONS",
    personImage: jorgeImage,
    companyLogo: xconsLogo
  },
  {
    id: 2,
    quote: "testimonials.mauro", // Clave para i18next
    name: "Mauro Schuzman",
    role: "Chief Technology Officer at Fusion AI",
    personImage: mauroImage,
    companyLogo: fusionadsLogo
  },
  {
    id: 3,
    quote: "testimonials.milena", // Clave para i18next
    name: "Milena Pasetti",
    role: "Digital Specialist",
    personImage: milenaImage,
    companyLogo: xconsLogo // Milena también usa el logo de XCONS
  },
  {
    id: 4,
    quote: "testimonials.kodi", // Clave para i18next
    name: "Kodi Martinez",
    role: "CEO at Bandit",
    personImage: kodiImage,
    companyLogo: banditLogo
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
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  max-width: 800px; 
  margin: 0 auto;
  padding-bottom: 50px;

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
    background-color: ${({ theme }) => theme.colors.text};
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
  padding: ${({ theme }) => theme.space.xl};
  border-radius: 20px;
  max-width: 90%; 
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  ${glassEffect}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const PersonImage = styled.img`
  width: 60px;
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
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-style: italic;
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.text}dd;
  line-height: 1.6;
  quotes: "\201C" "\201D" "\2018" "\2019";
  flex-grow: 1;
  position: relative;
  padding-left: 2.5rem;

  &::before {
    content: open-quote;
    font-size: 4em;
    position: absolute;
    left: 0;
    top: -0.1em;
    line-height: 1;
    color: ${({ theme }) => theme.colors.primary}aa;
  }
`;

const Author = styled.p`
  font-weight: bold;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const Role = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text}aa;
  margin: 0;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.space.md};
  opacity: 0.7;
`;

const CompanyLogo = styled.img`
  max-height: 30px;
  max-width: 100px;
  object-fit: contain;
`;

const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
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
              <div> 
                <CardHeader>
                  <PersonImage src={testimonial.personImage} alt={testimonial.name} />
                  <AuthorInfo>
                    <Author>{testimonial.name}</Author>
                    <Role>{testimonial.role}</Role>
                  </AuthorInfo>
                </CardHeader>
                <Quote>{t(testimonial.quote)}</Quote>
              </div>
              <CardFooter>
                <CompanyLogo src={testimonial.companyLogo} alt={`${testimonial.name}'s company logo`} />
              </CardFooter>
            </TestimonialCard>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </Section>
  );
};

export default TestimonialsSection; 