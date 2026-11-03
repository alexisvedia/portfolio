import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FONT, INK, TEAM_VOICE } from './content';
import avatar from '@/assets/poster/voz-cubiq.webp';

gsap.registerPlugin(ScrollTrigger);

/** Testimonio destacado como mockup del chat del equipo: "escribiendo…", entra el mensaje y caen las reacciones. */
const TeamVoice: React.FC = () => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(el);
      gsap.set(q('[data-typing]'), { autoAlpha: 1 });
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 70%', once: true } })
        .from(el, { y: 60, rotate: -3, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from(q('[data-dot]'), { y: 4, repeat: 3, yoyo: true, stagger: 0.12, duration: 0.18, ease: 'sine.inOut' })
        .to(q('[data-typing]'), { autoAlpha: 0, height: 0, marginTop: 0, duration: 0.2 })
        .from(q('[data-msg]'), { y: 16, scale: 0.96, opacity: 0, transformOrigin: '0 0', duration: 0.5, ease: 'back.out(1.6)' })
        .from(q('[data-react]'), { scale: 0, opacity: 0, stagger: 0.12, duration: 0.4, ease: 'back.out(3)' }, '-=0.1');
    });
    return () => mm.revert();
  }, []);

  const v = TEAM_VOICE;
  return (
    <Window ref={ref} aria-label={`Testimonio de ${v.name}, ${v.role}`}>
      <Bar aria-hidden="true">
        <i />
        <i />
        <i />
        <span># {v.room}</span>
      </Bar>
      <Body>
        <img src={avatar} alt="" width={160} height={160} loading="lazy" />
        <div>
          <Head>
            <strong>{v.name}</strong>
            <small>{v.role}</small>
            <time>{v.time}</time>
          </Head>
          <Typing data-typing="" aria-hidden="true">
            <span data-dot="" />
            <span data-dot="" />
            <span data-dot="" />
            escribiendo…
          </Typing>
          <blockquote data-msg="">
            <p>{v.text}</p>
          </blockquote>
          <Reactions aria-hidden="true">
            {v.reactions.map(r => (
              <li key={r.emoji} data-react="">
                {r.emoji} <b>{r.count}</b>
              </li>
            ))}
          </Reactions>
        </div>
      </Body>
    </Window>
  );
};

const Window = styled.figure`
  margin: 0 0 clamp(1rem, 3vh, 2rem);
  border-radius: clamp(1rem, 1.6vw, 1.6rem);
  background: ${INK.cream};
  color: ${INK.ground};
  overflow: hidden;
  box-shadow: 0 0 0 3px ${INK.ground}, 14px 14px 0 0 ${INK.red};
  rotate: 1deg;

  @media (prefers-reduced-motion: reduce) {
    rotate: 0deg;
  }
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.8rem 1.1rem;
  background: ${INK.ground};
  color: ${INK.cream};
  font-size: 0.9rem;

  i {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    background: ${INK.red};
  }
  i:nth-child(2) {
    background: ${INK.orange};
  }
  i:nth-child(3) {
    background: ${INK.lime};
  }
  span {
    margin-left: 0.6rem;
    opacity: 0.8;
  }
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: clamp(0.9rem, 2vw, 1.4rem);
  padding: clamp(1.2rem, 3vw, 2.2rem);

  img {
    width: clamp(3.6rem, 7vw, 5.5rem);
    height: auto;
    aspect-ratio: 1;
    border-radius: 50%;
    box-shadow: 0 0 0 3px ${INK.cream}, 0 0 0 6px ${INK.ground};
  }

  blockquote {
    margin: 0.6rem 0 0;
    padding: clamp(0.9rem, 2vw, 1.3rem) clamp(1rem, 2.4vw, 1.5rem);
    border-radius: 0.3rem 1.2rem 1.2rem 1.2rem;
    background: ${INK.ground};
    color: ${INK.cream};
  }

  blockquote p {
    margin: 0;
    font-size: clamp(1.05rem, 0.9rem + 0.6vw, 1.4rem);
    line-height: 1.4;
  }
`;

const Head = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.2rem 0.7rem;

  strong {
    font-family: ${FONT.display};
    font-weight: 800;
    font-size: 2rem;
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  small,
  time {
    font-size: 0.85rem;
    opacity: 0.7;
  }
`;

const Typing = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.6rem;
  font-size: 0.85rem;
  opacity: 0.7;
  visibility: hidden;
  height: 1.4rem;

  span {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: currentColor;
  }
  span:last-of-type {
    margin-right: 0.3rem;
  }

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const Reactions = styled.ul`
  display: flex;
  gap: 0.5rem;
  margin: 0.7rem 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    border: 2px solid ${INK.ground};
    font-size: 0.95rem;
  }
`;

export default TeamVoice;
