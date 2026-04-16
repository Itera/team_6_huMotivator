import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8f8ff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  text-align: center;
`;

const Settings: React.FC = () => {
  // TODO: Add selectors and sliders for personality, content type, humor level
  return (
    <Container>
      <h2>Innstillinger</h2>
      <p>Velg personlighetstype, innholdstype og humornivå.</p>
    </Container>
  );
};

export default Settings;
