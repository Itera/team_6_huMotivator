import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTheme } from "../components/ThemeProvider";
import { getModels, motivate } from "../services/api";

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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Button = styled.button`
  background: #0f8b8d;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #0b6f71;
  }
`;

const Loader = styled.div`
  margin: 1rem 0;
`;

const Home: React.FC = () => {
  const [task, setTask] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("llama3.2");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  React.useEffect(() => {
    const loadModels = async () => {
      try {
        const availableModels = await getModels();
        if (availableModels.length > 0) {
          setModels(availableModels);
          setSelectedModel(availableModels[0]);
        } else {
          setModels(["llama3.2"]);
        }
      } catch {
        setModels(["llama3.2"]);
      }
    };

    loadModels();
  }, []);

  const handleMotivate = async () => {
    setLoading(true);
    try {
      const response = await motivate(task, selectedModel);
      navigate("/result", { state: { result: response, theme } });
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
      <Select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </Select>
      <Button onClick={handleMotivate} disabled={loading || !task}>
        Motiver meg
      </Button>
      {loading && <Loader>Laster motivasjon...</Loader>}
    </Container>
  );
};

export default Home;
