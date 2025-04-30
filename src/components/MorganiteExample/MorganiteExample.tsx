import React from 'react';
import styled from 'styled-components';

const ExampleContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Morganite', sans-serif;
  font-weight: 900;
  font-size: 8rem;
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 5rem;
  }
`;

const Subtitle = styled.h2`
  font-family: 'Morganite', sans-serif;
  font-weight: 700;
  font-size: 4rem;
  line-height: 1.1;
  margin-bottom: 2rem;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const TextSample = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WeightExample = styled.p<{ weight: number }>`
  font-family: 'Morganite', sans-serif;
  font-weight: ${props => props.weight};
  font-size: 2.5rem;
  line-height: 1.2;
`;

const MorganiteExample: React.FC = () => {
  return (
    <ExampleContainer>
      <Title>Morganite Font</Title>
      <Subtitle>A modern display typeface</Subtitle>
      
      <TextSample>
        <WeightExample weight={100}>Weight 100 (Thin) - ABCDEFGHIJKLMNOPQRSTUVWXYZ</WeightExample>
        <WeightExample weight={200}>Weight 200 (ExtraLight) - ABCDEFGHIJKLMNOPQRSTUVWXYZ</WeightExample>
        <WeightExample weight={300}>Weight 300 (Light) - ABCDEFGHIJKLMNOPQRSTUVWXYZ</WeightExample>
        <WeightExample weight={400}>Weight 400 (Book) - ABCDEFGHIJKLMNOPQRSTUVWXYZ</WeightExample>
        <WeightExample weight={500}>Weight 500 (Medium) - ABCDEFGHIJKLMNOPQRSTUVWXYZ</WeightExample>
        <WeightExample weight={600}>Weight 600 (SemiBold) - ABCDEFGHIJKLMNOPQRSTUVWXYZ</WeightExample>
        <WeightExample weight={700}>Weight 700 (Bold) - ABCDEFGHIJKLMNOPQRSTUVWXYZ</WeightExample>
        <WeightExample weight={800}>Weight 800 (ExtraBold) - ABCDEFGHIJKLMNOPQRSTUVWXYZ</WeightExample>
        <WeightExample weight={900}>Weight 900 (Black) - ABCDEFGHIJKLMNOPQRSTUVWXYZ</WeightExample>
      </TextSample>
    </ExampleContainer>
  );
};

export default MorganiteExample; 