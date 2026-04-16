import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  text-align: center;
`;

const Card = styled.div`
  background: #f4f3ec;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
`;

const Button = styled.button`
  background: #aa3bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
  &:hover {
    background: #7a2bbd;
  }
`;


const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // The backend should return an object with motivational content
  const result = location.state?.result;

  // Example fallback if user navigates directly
  if (!result) {
    return (
      <Container>
        <h2>Ingen motivasjon funnet</h2>
        <Button onClick={() => navigate('/')}>Tilbake</Button>
      </Container>
    );
  }

  return (
    <Container>
      <h2>Resultat</h2>
      <Card>
        <strong>Motivasjon:</strong>
        <p>{result.text || 'Ingen tekst mottatt.'}</p>
        {/* Render facts, images, quotes, etc. if present */}
        {result.facts && <div><strong>Fakta:</strong> <p>{result.facts}</p></div>}
        {result.image && <img src={result.image} alt="Motivasjonsbilde" style={{maxWidth:'100%',margin:'1rem 0'}} />}
        {result.quote && <div><strong>Sitat:</strong> <p>{result.quote}</p></div>}
      </Card>
      <Button onClick={() => navigate('/')}>Få ny inspirasjon</Button>
    </Container>
  );
};

export default Result;
