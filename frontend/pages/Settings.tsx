import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getModels, poem, type PoemResponse } from "../services/api";

const C = {
  primary: "#ff7cf5",
  secondary: "#c3f400",
  tertiary: "#c1fffe",
  bg: "#0e0e0e",
  surface: "#1a1a1a",
  surfaceLow: "#131313",
  surfaceHigh: "#20201f",
  onSurface: "#ffffff",
  onSurfaceVar: "#adaaaa",
  onPrimary: "#580058",
  onSecondary: "#455900",
};

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: ${C.surfaceLow};
  border-bottom: 4px solid ${C.secondary};
  box-shadow: 0 4px 20px rgba(195, 244, 0, 0.3);
`;

const Logo = styled.h1`
  font-family: "Epilogue", sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: 1.75rem;
  text-transform: uppercase;
  letter-spacing: -0.05em;
  color: ${C.primary};
  margin: 0;
`;

const Main = styled.main`
  padding: 6rem 1.5rem 8rem;
  max-width: 1024px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-family: "Epilogue", sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: clamp(2.2rem, 7vw, 4.4rem);
  text-transform: uppercase;
  letter-spacing: -0.05em;
  color: ${C.onSurface};
  margin: 0 0 1.5rem 0;

  span {
    color: ${C.secondary};
    text-shadow: 4px 4px 0px #580058;
  }
`;

const Card = styled.section`
  background: ${C.surface};
  border: 2px solid rgba(72, 72, 71, 0.3);
  padding: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: "Space Grotesk", sans-serif;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${C.tertiary};
  margin-bottom: 0.6rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #474747;
  background: ${C.surfaceHigh};
  color: ${C.onSurface};
  font-family: "Space Grotesk", sans-serif;
  margin-bottom: 1rem;
  box-sizing: border-box;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1rem;
`;

const Chip = styled.button<{ selected?: boolean }>`
  border: 1px solid ${({ selected }) => (selected ? C.secondary : "#555")};
  background: ${({ selected }) => (selected ? "#506600" : C.surfaceLow)};
  color: ${({ selected }) => (selected ? C.secondary : C.onSurfaceVar)};
  padding: 0.45rem 0.8rem;
  font-family: "Space Grotesk", sans-serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
`;

const Action = styled.button`
  border: none;
  background: ${C.primary};
  color: ${C.onPrimary};
  font-family: "Epilogue", sans-serif;
  font-size: 1rem;
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  padding: 0.9rem 1.2rem;
  cursor: pointer;
  box-shadow: 5px 5px 0 ${C.secondary};

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const Output = styled.article`
  margin-top: 1rem;
  background: ${C.surfaceHigh};
  border-left: 4px solid ${C.secondary};
  padding: 1rem;
`;

const PoemText = styled.pre`
  white-space: pre-wrap;
  font-family: "Space Grotesk", sans-serif;
  line-height: 1.5;
  margin: 0;
  color: ${C.onSurface};
`;

const Meta = styled.p`
  margin: 0.6rem 0 0 0;
  color: ${C.onSurfaceVar};
  font-size: 0.85rem;
`;

const Hint = styled.p`
  color: ${C.onSurfaceVar};
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
`;

const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  display: flex;
  justify-content: space-around;
  height: 5rem;
  background: ${C.bg};
  border-top: 4px solid ${C.primary};
`;

const NavItem = styled.button<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${({ active }) => (active ? C.secondary : "transparent")};
  color: ${({ active }) => (active ? C.onSecondary : C.primary)};
  opacity: ${({ active }) => (active ? 1 : 0.6)};
`;

const NavLabel = styled.span`
  font-family: "Space Grotesk", sans-serif;
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [models, setModels] = useState<string[]>(["llama3.2"]);
  const [selectedModel, setSelectedModel] = useState("llama3.2");
  const [loading, setLoading] = useState(false);
  const [poemResult, setPoemResult] = useState<PoemResponse | null>(null);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    let active = true;

    const loadModels = async () => {
      try {
        const available = await getModels();
        if (!active || available.length === 0) return;
        setModels(available);
        setSelectedModel((current) => (available.includes(current) ? current : available[0]));
      } catch {
        if (!active) return;
        setModels(["llama3.2"]);
      }
    };

    loadModels();
    return () => {
      active = false;
    };
  }, []);

  const handleGeneratePoem = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setErrorText("");
    try {
      const response = await poem(topic.trim(), selectedModel);
      setPoemResult(response);
    } catch {
      setErrorText("Klarte ikke å lage dikt nå. Prøv igjen om litt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header>
        <Logo>HUMOTIVATOREN</Logo>
      </Header>

      <Main>
        <Title>
          POESI-<br />
          <span>MODUS.</span>
        </Title>

        <Hint>
          Lag et kort, energisk dikt om temaet du trenger motivasjon for.
        </Hint>

        <Card>
          <Label htmlFor="topic">Tema</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="f.eks. hackathon, presentasjon, mandagsmøte"
          />

          <Label>Velg modell</Label>
          <ChipRow>
            {models.map((model) => (
              <Chip
                key={model}
                selected={selectedModel === model}
                type="button"
                onClick={() => setSelectedModel(model)}
              >
                {model}
              </Chip>
            ))}
          </ChipRow>

          <Action
            type="button"
            disabled={!topic.trim() || loading}
            onClick={handleGeneratePoem}
          >
            {loading ? "Lager dikt..." : "Generer dikt"}
          </Action>

          {errorText && <Meta>{errorText}</Meta>}

          {poemResult && (
            <Output>
              <PoemText>{poemResult.poem}</PoemText>
              <Meta>
                Modell: {poemResult.model_used} | Sikkerhet: {poemResult.safety_note}
              </Meta>
            </Output>
          )}
        </Card>
      </Main>

      <BottomNav>
        <NavItem onClick={() => navigate("/")} type="button">
          <span className="material-symbols-outlined">home</span>
          <NavLabel>HOME</NavLabel>
        </NavItem>
        <NavItem active onClick={() => navigate("/settings")} type="button">
          <span className="material-symbols-outlined">graphic_eq</span>
          <NavLabel>POETRY</NavLabel>
        </NavItem>
      </BottomNav>
    </>
  );
};

export default Settings;
