import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface LanguageMorphingTitleProps {
  translationKey: string;
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
}

const MorphContainer = styled.div<{ $shouldMorph: boolean }>`
  position: relative;
  width: 100%;
  height: auto;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  font-size: clamp(2.5rem, 5vw, 7rem);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    min-height: 160px;
    margin-bottom: 2rem;
    font-size: clamp(3.5rem, 8vw, 10rem);
  }
`;


const SectionTitle = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;


const MIN_ANIMATION_DURATION = 2500;

const LanguageMorphingTitle: React.FC<LanguageMorphingTitleProps> = ({
  translationKey,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const [shouldMorph, setShouldMorph] = useState(false);
  const [texts, setTexts] = useState<string[]>(['', '']);


  const previousLanguageRef = useRef<string>(i18n.language);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);
  const isChangingRef = useRef(false);
  const lastChangeTimeRef = useRef<number>(0);


  useEffect(() => {
    if (!initializedRef.current) {
  
      const currentText = t(translationKey);
      setTexts([currentText, currentText]);
      initializedRef.current = true;
    }
  }, [t, translationKey]);


  const getTotalAnimationDuration = () => {

    const calculatedDuration = (morphTime + cooldownTime) * 1000 + 500;
    return Math.max(calculatedDuration, MIN_ANIMATION_DURATION);
  };


  useEffect(() => {

    if (isChangingRef.current) {
      return;
    }


    if (previousLanguageRef.current !== i18n.language) {
      const now = Date.now();


      const timeElapsed = now - lastChangeTimeRef.current;
      if (timeElapsed < MIN_ANIMATION_DURATION) {

      }

      isChangingRef.current = true;
      lastChangeTimeRef.current = now;


      const oldText = t(translationKey, { lng: previousLanguageRef.current });


      const newText = t(translationKey, { lng: i18n.language });


      if (oldText !== newText) {

        setTexts([oldText, newText]);
        setShouldMorph(true);


        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
          animationTimeoutRef.current = null;
        }


        const totalDuration = getTotalAnimationDuration();

        animationTimeoutRef.current = setTimeout(() => {
          setShouldMorph(false);
          isChangingRef.current = false;
          animationTimeoutRef.current = null;


          const finalText = t(translationKey);
          setTexts([finalText, finalText]);
        }, totalDuration);
      } else {

        isChangingRef.current = false;
      }


      previousLanguageRef.current = i18n.language;
    }
  }, [i18n.language, t, translationKey, morphTime, cooldownTime]);


  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, []);


  if (!texts[0] && !texts[1]) {
    const currentText = t(translationKey);
    return (
      <MorphContainer className={className} $shouldMorph={false}>
        <SectionTitle>{currentText}</SectionTitle>
      </MorphContainer>
    );
  }

  return (
    <MorphContainer className={className} $shouldMorph={shouldMorph}>
      <SectionTitle>
        {shouldMorph ? texts[1] : texts[0]}
      </SectionTitle>
    </MorphContainer>
  );
};

export default LanguageMorphingTitle;
