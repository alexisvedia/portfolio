import React, { useLayoutEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FONT, INK, TEAM_VOICE } from './content';
import avatar from '@/assets/poster/voz-cubiq.webp';
import { cut, SHADOW } from './cut';

gsap.registerPlugin(ScrollTrigger);

// Contorno cortado a mano en porcentajes, para estirarlo con clip-path sobre la caja de cada pieza.
const clip = (seed: number) => `polygon(${cut(50, 50, 50, seed).map(([x, y]) => `${x.toFixed(1)}% ${y.toFixed(1)}%`).join(', ')})`;
const cutVar = (seed: number) => ({ '--cut': clip(seed) }) as React.CSSProperties;

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
        // Los puntitos saltan por poses (stop motion), no rebotan.
        .to(q('[data-dot]'), { y: -5, repeat: 5, yoyo: true, stagger: 0.12, duration: 0.24, ease: 'steps(2)' })
        .to(q('[data-typing]'), { autoAlpha: 0, height: 0, marginTop: 0, duration: 0.2 })
        .from(q('[data-msg]'), { y: 16, scale: 0.96, opacity: 0, transformOrigin: '0 0', duration: 0.5, ease: 'back.out(1.6)' })
        // Cada reacción aparece de golpe y se apoya en dos poses, como un papel que cae girado.
        .from(q('[data-react]'), { autoAlpha: 0, stagger: 0.14, duration: 0.01 }, 'react-=0.1')
        .from(q('[data-react]'), { x: 6, y: -12, rotation: -12, stagger: 0.14, duration: 0.3, ease: 'steps(2)' }, 'react-=0.1');
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
            <span style={cutVar(7)}>
              <i data-dot="" style={cutVar(11)} />
              <i data-dot="" style={cutVar(12)} />
              <i data-dot="" style={cutVar(13)} />
            </span>
            escribiendo…
          </Typing>
          <blockquote data-msg="">
            <p>{v.text}</p>
          </blockquote>
          <Reactions aria-hidden="true">
            {v.reactions.map((r, i) => (
              <li key={r.emoji} data-react="" style={cutVar(21 + i)}>
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

/* Pieza de papel recortado: la sombra negra es otra pieza corrida abajo a la derecha y la luz,
   una faceta lima arriba a la izquierda recortada por el mismo contorno. Cada pieza trae su --cut. */
const paper = css`
  position: relative;
  isolation: isolate;
  color: ${INK.cream};

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    clip-path: var(--cut);
  }
  &::before {
    z-index: -2;
    translate: 3px 4px;
    background: ${SHADOW};
  }
  &::after {
    z-index: -1;
    background: linear-gradient(124deg, ${INK.lime} 0 24%, ${INK.violet} 24%);
  }
`;

const Typing = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.6rem;
  font-size: 0.85rem;
  /* La opacidad va solo en el texto: sobre la burbuja aclararía la sombra negra. */
  color: color-mix(in srgb, ${INK.ground} 70%, transparent);
  visibility: hidden;
  height: 2rem;

  > span {
    ${paper}
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.8rem;
  }
  i {
    width: 0.45rem;
    height: 0.45rem;
    background: ${INK.cream};
    clip-path: var(--cut);
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
    ${paper}
    padding: 0.3rem 0.8rem;
    font-size: 0.95rem;
    rotate: -2deg;
  }
  li:nth-child(even) {
    rotate: 2.5deg;
  }
  b {
    color: ${INK.cream};
  }
`;

export default TeamVoice;
