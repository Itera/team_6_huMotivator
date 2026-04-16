import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8f8ff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  text-align: center;
`;

const Settings: React.FC = () => {
  return (
    <Container>
      <h2>Innstillinger</h2>
      <p>
        Denne MVP-en bruker modellvalg fra forsiden. Neste steg er personlighet,
        innholdstype og humornivå.
      </p>
      <p>
        Tips: Start med en konkret oppgave, velg modell, og bruk resultat-siden i
        demoen.
      </p>
    </Container>
  );
};

export default Settings;
