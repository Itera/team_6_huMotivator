import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTheme, useThemeVars } from "../components/ThemeProvider";
import { getModels, motivate } from "../services/api";

const Container = styled.div<{ bg: string; color: string }>`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  text-align: center;
  transition: background 0.3s, color 0.3s;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

interface CoachButtonProps {
  selected?: boolean;
  themeVars: any;
}

const CoachButton = styled.button<CoachButtonProps>`
  background: ${({ selected, themeVars }) =>
    selected ? themeVars.buttonSelected : themeVars.button};
  color: ${({ selected, themeVars }) =>
    selected ? themeVars.buttonSelectedText : themeVars.buttonText};
  border: ${({ selected, themeVars }) =>
    selected ? `2px solid ${themeVars.buttonSelected}` : '2px solid transparent'};
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, border 0.2s, color 0.2s;
  &:hover {
    background: ${({ selected, themeVars }) =>
      selected ? themeVars.button : themeVars.buttonSelected};
    color: ${({ selected, themeVars }) =>
      selected ? themeVars.buttonText : themeVars.buttonSelectedText};
  }
`;

const CoachSelector = styled.div`
  margin-bottom: 1.5rem;
`;

const CoachButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 0.5rem;
`;

const Loader = styled.div`
  margin: 1rem 0;
`;

const coaches = [
  { key: "military", name: "Militærleder", description: "Streng, disiplinert og motiverer med tøff kjærlighet." },
  { key: "psychologist", name: "Psykolog", description: "Lyttende, forståelsesfull og hjelper deg å finne din indre motivasjon." },
  { key: "artist", name: "Spirituell Kunstner", description: "Gir deg kreative og kosmiske råd, som å klappe en rosa stein fordi stjernene står rett." },
];

const Home: React.FC = () => {
  const [task, setTask] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("llama3.2");
  const [loading, setLoading] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<string>("serious");
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const themeVars = useThemeVars();

  const handleCoachSelect = (coachKey: string) => {
    setSelectedCoach(coachKey);
    setTheme(coachKey); // This will update the theme in ThemeProvider
  };

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
    <Container bg={themeVars.background} color={themeVars.color}>
      <h1>HuMotivatoren</h1>
      <p>Beskriv oppgaven din og få motivasjon!</p>

      <CoachSelector>
        <strong>Velg coach:</strong>
        <CoachButtonGroup>
          {coaches.map((coach) => (
            <CoachButton
              key={coach.key}
              type="button"
              selected={selectedCoach === coach.key}
              onClick={() => handleCoachSelect(coach.key)}
              themeVars={themeVars}
            >
              {coach.name}
            </CoachButton>
          ))}
        </CoachButtonGroup>
      </CoachSelector>

      <Input
        type="text"
        placeholder="Hva skal du gjøre?"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
  <CoachButton onClick={handleMotivate} disabled={loading || !task} themeVars={themeVars}>
        Motiver meg
      </CoachButton>
      {loading && <Loader>Laster motivasjon...</Loader>}
    </Container>
  );
};

export default Home;
