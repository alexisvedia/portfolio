import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LanguageMorphingTitle from '@components/LanguageMorphingTitle';
import PageTransition from '@components/PageTransition/PageTransition';
import profileImage from '../assets/profile-image.webp';

const StyledMorphingTitle = styled(LanguageMorphingTitle)`
  font-size: clamp(2.5rem, 5vw, 7rem);
  font-weight: 900;
  margin-bottom: 2.5rem;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: clamp(3.5rem, 8vw, 10rem);
  }
`;

const SectionContent = styled.div`
  max-width: 800px;
  width: 100%;
  margin-bottom: 2rem;

  /* Estilos para párrafos dentro del contenido */
  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.8;
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.space.xl};
  padding-top: 5rem;
  gap: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageTransition>
      <Content>
        <StyledMorphingTitle translationKey="navbar.about" morphTime={0.8} cooldownTime={0.2} />
        <SectionContent>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                height: '300px',
                width: '300px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                margin: '0 auto',
                order: 1,
              }}
            >
              <img
                src={profileImage}
                alt={t('navbar.about')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            <div style={{ order: 2 }}>
              <p>{t('about.bio.part1')}</p>
              <p>{t('about.bio.part2')}</p>
            </div>
          </div>
        </SectionContent>

        <SectionContent>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3
              style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {t('about.professionalExperience')}
            </h3>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4
              style={{
                fontSize: '1.4rem',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {t('about.jobs.fullStackEngineer')}
            </h4>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '0.5rem',
              }}
            >
              {t('about.jobs.fusionOS')}
            </p>
            <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1.5rem' }}>
              {(t('about.jobDescriptions.fusionOS', { returnObjects: true }) as string[]).map(
                (description: string, index: number) => (
                  <li key={index}>{description}</li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontSize: '1.4rem',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {t('about.jobs.uiUxDesigner')}
            </h4>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '0.5rem',
              }}
            >
              {t('about.jobs.xcons')}
            </p>
            <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1.5rem' }}>
              {(t('about.jobDescriptions.xcons', { returnObjects: true }) as string[]).map(
                (description: string, index: number) => (
                  <li key={index}>{description}</li>
                )
              )}
            </ul>
          </div>
        </SectionContent>

        <SectionContent>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3
              style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {t('about.featuredProjects')}
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            <div
              style={{
                background: 'rgba(60, 60, 80, 0.3)',
                borderRadius: '0.8rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <h4
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {t('about.projects.personalPortfolio')}
              </h4>
              <p>{t('about.projects.personalPortfolioDesc')}</p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  React
                </span>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  TypeScript
                </span>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Styled Components
                </span>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(60, 60, 80, 0.3)',
                borderRadius: '0.8rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <h4
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {t('about.projects.ecommerceApp')}
              </h4>
              <p>{t('about.projects.ecommerceAppDesc')}</p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  React
                </span>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Redux
                </span>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Node.js
                </span>
              </div>
            </div>
          </div>
        </SectionContent>

        <SectionContent>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3
              style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {t('about.skills')}
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {t('about.skillCategories.fullStack')}
              </h4>
              <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1.5rem' }}>
                <li>React / React Native</li>
                <li>TypeScript / JavaScript</li>
                <li>HTML5 / CSS3</li>
                <li>Styled Components</li>
                <li>Redux / Context API</li>
                <li>Python (Django, Flask, FastAPI)</li>
              </ul>
            </div>

            <div>
              <h4
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {t('about.skillCategories.backend')}
              </h4>
              <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1.5rem' }}>
                <li>Node.js</li>
                <li>Express</li>
                <li>MongoDB</li>
                <li>Firebase</li>
                <li>RESTful APIs</li>
              </ul>
            </div>

            <div>
              <h4
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {t('about.skillCategories.tools')}
              </h4>
              <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1.5rem' }}>
                <li>Git / GitHub / Bitbucket / Jira / Trello</li>
                <li>WordPress (nivel avanzado) / Elementor</li>
                <li>Webpack / Vite</li>
                <li>Figma / Adobe Suite (Photoshop, Illustrator)</li>
                <li>Postman / Jest / Testing Library</li>
                <li>n8n (Automatizaciones)</li>
              </ul>
            </div>
          </div>
        </SectionContent>
      </Content>
    </PageTransition>
  );
};

export default About;
