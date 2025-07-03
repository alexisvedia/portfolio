import React, { useEffect, useRef, useMemo, ReactNode, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;


    gsap.fromTo(
      el,
      { 
        transformOrigin: "0% 50%", 
        rotate: baseRotation,
        y: 20
      },
      {
        ease: "power2.out",
        rotate: 0,
        y: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: "top bottom",
          end: rotationEnd,
          scrub: 0.8,
        },
      }
    );

    const wordElements = el.querySelectorAll<HTMLElement>(".word");


    gsap.fromTo(
      wordElements,
      { 
        opacity: baseOpacity, 
        willChange: "opacity, transform", 
        y: 40, 
        scale: 0.8,
        rotateX: 10
      },
      {
        ease: "power3.out",
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        stagger: 0.03,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: "top bottom-=15%",
          end: wordAnimationEnd,
          scrub: 0.6,
        },
      }
    );


    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { 
          filter: `blur(${blurStrength}px)`,
          willChange: "filter" 
        },
        {
          ease: "power4.out",
          filter: "blur(0px)",
          stagger: 0.03,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom-=15%",
            end: wordAnimationEnd,
            scrub: 0.6,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
  ]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;