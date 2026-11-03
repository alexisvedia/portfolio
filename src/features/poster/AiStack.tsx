import React from 'react';
import styled from 'styled-components';
import { AI_STACK, FONT, INK } from './content';
import { AI_AGENTS } from './aiAgents';
import StatusLine from './StatusLine';

/* Colores de sombra de cada bloque, en el orden de AI_STACK.blocks. */
const SHADOW = [INK.red, INK.blue, INK.lime, INK.violet, INK.teal, INK.orange];

/** Stack de IA: los modelos que uso, cómo está armado el entorno de agentes y un caso de RAG. */
const AiStack: React.FC = () => (
  <>
    <Models data-reveal="" aria-label="Modelos con los que trabajo">
      {AI_AGENTS.map(({ id, name, color, ink, Icon }) => (
        <li key={id} style={{ background: color, color: ink }}>
          <Icon aria-hidden="true" />
          {name}
        </li>
      ))}
    </Models>

    <Grid>
      {AI_STACK.blocks.map((b, i) => (
        <Block key={b.title} data-reveal="" style={{ '--shadow': SHADOW[i % SHADOW.length] } as React.CSSProperties}>
          <h3>{b.title}</h3>
          <p>{b.text}</p>
          {'stats' in b && b.stats && (
            <Stats>
              {b.stats.map(s => (
                <li key={s.label}>
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </li>
              ))}
            </Stats>
          )}
          {'tools' in b && b.tools && (
            <Chips>
              {b.tools.map(t => (
                <li key={t}>{t}</li>
              ))}
            </Chips>
          )}
        </Block>
      ))}
    </Grid>

    <StatusLine />

    <Case data-reveal="">
      <small>Caso</small>
      <h3>{AI_STACK.case.title}</h3>
      <p>{AI_STACK.case.text}</p>
    </Case>

    <Chips data-reveal="" aria-label="Lo que sé de IA" $wide>
      {AI_STACK.skills.map(s => (
        <li key={s}>{s}</li>
      ))}
    </Chips>
  </>
);

const Models = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 0 clamp(1.5rem, 4vh, 2.5rem);
  padding: 0;
  list-style: none;

  li {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.85rem 0.45rem 0.6rem;
    border-radius: 999px;
    font-family: ${FONT.text};
    font-size: 0.95rem;
    font-weight: 500;
    line-height: 1;
  }
  svg {
    width: 1.1rem;
    height: 1.1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr));
  gap: clamp(1rem, 2.4vw, 1.75rem);
`;

const Block = styled.article`
  display: grid;
  align-content: start;
  gap: 0.75rem;
  padding: clamp(1.2rem, 2.4vw, 1.75rem);
  border: 2px solid ${INK.cream};
  border-radius: clamp(0.8rem, 1.2vw, 1.2rem);
  background: ${INK.ground};
  box-shadow: 8px 8px 0 0 var(--shadow);

  h3 {
    margin: 0;
    font-family: ${FONT.display};
    font-size: clamp(2.2rem, 1.6rem + 1.8vw, 3.2rem);
    font-weight: 400;
    line-height: 0.9;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: ${INK.cream};
  }
  && p {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const Stats = styled.ul`
  display: grid;
  gap: 0.6rem;
  margin: 0.25rem 0 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: 4.2rem 1fr;
    align-items: baseline;
    gap: 0.6rem;
  }
  b {
    font-family: ${FONT.display};
    font-size: 2.6rem;
    font-weight: 400;
    line-height: 0.8;
    color: var(--shadow);
  }
  span {
    font-size: 0.92rem;
    color: rgba(239, 230, 200, 0.75);
  }
`;

const Chips = styled.ul<{ $wide?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: ${p => (p.$wide ? 'clamp(1.5rem, 4vh, 2.5rem) 0 0' : '0.25rem 0 0')};
  padding: 0;
  list-style: none;

  li {
    padding: 0.35rem 0.7rem;
    border: 1.5px solid rgba(239, 230, 200, 0.45);
    border-radius: 999px;
    font-size: 0.85rem;
    line-height: 1.1;
    color: ${INK.cream};
  }
`;

const Case = styled.article`
  display: grid;
  gap: 0.5rem;
  margin-top: clamp(1.5rem, 4vh, 2.5rem);
  padding: clamp(1.2rem, 2.4vw, 1.75rem);
  border-radius: clamp(0.8rem, 1.2vw, 1.2rem);
  background: ${INK.cream};
  color: ${INK.ground};
  box-shadow: 10px 10px 0 0 ${INK.red};

  small {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${INK.red};
  }
  h3 {
    margin: 0;
    font-family: ${FONT.display};
    font-size: clamp(2.2rem, 1.6rem + 1.8vw, 3.2rem);
    font-weight: 400;
    line-height: 0.9;
    text-transform: uppercase;
  }
  && p {
    margin: 0;
    max-width: 60ch;
    color: ${INK.ground};
  }
`;

export default AiStack;
