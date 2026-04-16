import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { motivate } from "../services/api";
import { neonFlicker, scanlineSweep, blink, buttonShake, glowPulse } from "../components/animations";

const C = {
  bg:          "#131313",
  bgDeep:      "#0e0e0e",
  surface:     "#1f1f1f",
  surfaceHigh: "#2a2a2a",
  primary:     "#ff00ff",
  onPrimary:   "#5b005b",
  secondary:   "#c3f400",
  onSecondary: "#283500",
  tertiary:    "#00daf3",
  error:       "#ffb4ab",
  errorContainer: "#93000a",
  onSurface:   "#e2e2e2",
  onSurfaceVar:"#dcbed4",
  outline:     "#a4899d",
};

const coachMeta: Record<string, { name: string; badge: string; accent: string; badgeColor: string; badgeText: string; symbol: string; placeholder: string }> = {
  coach1: { name: "Drill Sergeant", badge: "MILITARY",  accent: C.error,    badgeColor: C.errorContainer, badgeText: "#fff",       symbol: "⚔", placeholder: "HVA SKAL DU KNUSE I DAG, SOLDAT?" },
  coach2: { name: "The Zen Psych",  badge: "EMPATHY",   accent: C.primary,  badgeColor: C.primary,        badgeText: C.onPrimary,  symbol: "☯", placeholder: "HVVA TRENGER DU HJELP MED I DAG?" },
  coach3: { name: "Crystal Mystic", badge: "SPIRIT",    accent: C.tertiary, badgeColor: C.tertiary,       badgeText: "#00363d",    symbol: "✦", placeholder: "HVILKEN OPPGAVE PLAGER ENERGIEN DIN?" },
};

const ScanlineOverlay = styled.div`
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.15;
  background:
    linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.12) 50%),
    linear-gradient(90deg, rgba(255,0,0,0.02), rgba(0,255,0,0.01), rgba(0,0,255,0.02));
  background-size: 100% 4px, 3px 100%;
`;

const Header = styled.header`
  position: fixed;
  top: 0; left: 0; width: 100%;
  z-index: 50;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(19,19,19,0.5);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 20px rgba(255,0,255,0.3);
`;

const Logo = styled.h1`
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: 1.75rem;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  color: ${C.primary};
  margin: 0;
  animation: ${neonFlicker} 8s infinite;
  cursor: default;
`;

const BackBtn = styled.button`
  background: transparent;
  border: none;
  color: ${C.onSurfaceVar};
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover { color: ${C.onSurface}; }
`;

const Main = styled.main`
  position: relative;
  z-index: 10;
  padding: 8rem 1.5rem 6rem;
  min-height: 100vh;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CoachBadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Badge = styled.div<{ color: string; textColor: string }>`
  background: ${({ color }) => color};
  color: ${({ textColor }) => textColor};
  padding: 0.3rem 1rem;
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  transform: skewX(-10deg);
`;

const CoachSymbol = styled.div<{ color: string }>`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${C.surface};
  border: 2px solid ${({ color }) => color};
  color: ${({ color }) => color};
  font-size: 1.5rem;
  animation: ${glowPulse} 2s ease-in-out infinite;
  color: ${({ color }) => color};
`;

const PageTitle = styled.h2`
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-size: clamp(3rem, 9vw, 5.5rem);
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 1;
  color: ${C.onSurface};
  margin: 0 0 3rem;
`;

const TitleAccent = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  text-shadow: 0 0 12px ${({ color }) => color}88;
`;

const InputArea = styled.div`
  position: relative;
  margin-bottom: 2.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 0; height: 4px;
    background: ${C.secondary};
    box-shadow: 0 0 15px ${C.secondary};
    transition: width 0.4s cubic-bezier(0,1,0,1);
  }
  &:focus-within::after { width: 100%; }
`;

const TaskInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${C.outline};
  color: ${C.onSurface};
  font-family: 'Epilogue', sans-serif;
  font-weight: 700;
  font-size: clamp(1.25rem, 3vw, 2rem);
  text-transform: uppercase;
  padding: 1.25rem 0;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder { opacity: 0.25; color: ${C.onSurface}; }
  &:focus { border-bottom-color: ${C.secondary}; }
`;


const SubmitBtn = styled.button<{ accent: string }>`
  background: ${C.primary};
  color: ${C.onPrimary};
  border: none;
  padding: 1.25rem 3rem;
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  cursor: pointer;
  box-shadow: 6px 6px 0px ${({ accent }) => accent};
  transition: none;

  &:hover:not(:disabled) {
    animation: ${buttonShake} 0.3s steps(1) 1;
    box-shadow: 8px 8px 0px ${C.tertiary};
  }
  &:active:not(:disabled) { transform: translate(4px,4px); box-shadow: 2px 2px 0px ${({ accent }) => accent}; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;

const LoadingText = styled.span`
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  animation: ${neonFlicker} 0.8s infinite;
`;

const HintRow = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  opacity: 0.4;
`;
const HintLine = styled.div`
  height: 1px;
  width: 2rem;
  background: ${C.onSurface};
`;
const HintText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0;
`;

const ScanlineSweep = styled.div`
  pointer-events: none;
  position: fixed;
  left: 0; width: 100%; height: 8px;
  z-index: 1;
  background: linear-gradient(to bottom, transparent, rgba(195,244,0,0.15), transparent);
  animation: ${scanlineSweep} 6s linear infinite;
`;

const BlinkCursor = styled.span`
  display: inline-block;
  width: 3px;
  height: 1.2em;
  background: ${C.secondary};
  margin-left: 4px;
  vertical-align: text-bottom;
  animation: ${blink} 0.8s step-end infinite;
`;

const Prompt: React.FC = () => {
  const { coach = "coach1" } = useParams<{ coach: string }>();
  const meta = coachMeta[coach] ?? coachMeta.coach1;
  const navigate = useNavigate();
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!task.trim() || loading) return;
    setLoading(true);
    try {
      const result = await motivate(coach, task);
      navigate("/result", { state: { result, coach, coachName: meta.name } });
    } catch {
      const fallback = {
        motivation: "Serveren svarte ikke, men husk: du har allerede tatt det viktigste steget – du spurte om motivasjon. Nå er det bare å kjøre på! 💪",
        coach,
        safety_note: "Fallback – backend utilgjengelig",
        media: {
          type: "youtube",
          title: "Best Motivational Speech – Never Give Up",
          url: "https://www.youtube.com/watch?v=78I9dTB9vqM",
          thumbnail: "https://i.ytimg.com/vi/78I9dTB9vqM/hqdefault.jpg",
        },
        spotify: {
          type: "spotify",
          title: "Eye of the Tiger",
          artist: "Survivor",
          url: "https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2",
          image: "https://i.scdn.co/image/ab67616d0000b2734a052b99c042dc15f933145b",
        },
      };
      navigate("/result", { state: { result: fallback, coach, coachName: meta.name, isFallback: true } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScanlineOverlay />
      <ScanlineSweep />
      <Header>
        <Logo>HUMOTIVATOREN</Logo>
        <BackBtn onClick={() => navigate("/")}>
          <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_back</span>
          BYTT COACH
        </BackBtn>
      </Header>

      <Main>
        <CoachBadgeRow>
          <CoachSymbol color={meta.accent}>{meta.symbol}</CoachSymbol>
          <Badge color={meta.badgeColor} textColor={meta.badgeText}>{meta.badge}</Badge>
          <span style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 900, fontSize: "1.1rem", textTransform: "uppercase", color: meta.accent }}>
            {meta.name}
          </span>
        </CoachBadgeRow>

        <PageTitle>
          HVA SKAL DU <TitleAccent color={meta.accent}>GJØRE?</TitleAccent>
          <BlinkCursor />
        </PageTitle>

        <InputArea>
          <TaskInput
            autoFocus
            type="text"
            placeholder={meta.placeholder}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </InputArea>

        <SubmitBtn accent={meta.accent} onClick={handleSubmit} disabled={!task.trim() || loading}>
          {loading ? <LoadingText>HENTER MOTIVASJON...</LoadingText> : "MOTIVER MEG →"}
        </SubmitBtn>

        <HintRow>
          <HintLine />
          <HintText>TRYKK ENTER ELLER KNAPPEN FOR Å SENDE</HintText>
        </HintRow>
      </Main>
    </>
  );
};

export default Prompt;
