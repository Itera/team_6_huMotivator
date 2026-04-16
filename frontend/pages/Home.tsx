import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTheme } from "../components/ThemeProvider";
import { motivate } from "../services/api";

const Container = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8f8ff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Button = styled.button`
  background: #aa3bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #7a2bbd;
  }
`;

const Loader = styled.div`
  margin: 1rem 0;
`;

const Home: React.FC = () => {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleMotivate = async () => {
    setLoading(true);
    try {
      // Replace {} with user settings if needed
      const response = await motivate(task, { theme });
      navigate("/result", { state: { result: response.data } });
    } catch (error) {
      alert("Klarte ikke å hente motivasjon. Prøv igjen!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1>HuMotivatoren</h1>
      <p>Beskriv oppgaven din og få motivasjon!</p>
      <Input
        type="text"
        placeholder="Hva skal du gjøre?"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <Button onClick={handleMotivate} disabled={loading || !task}>
        Motiver meg
      </Button>
      {loading && <Loader>Laster motivasjon...</Loader>}
    </Container>
  );
};

export default Home;
