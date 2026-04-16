import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { neonFlicker, glitchText, scanlineSweep, cardEntrance, buttonShake } from "../components/animations";
import type { MotivateResponse } from "../services/api";

const C = {
  bg:          "#131313",
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

const coachAccent: Record<string, string> = {
  coach1: C.error,
  coach2: C.primary,
  coach3: C.tertiary,
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

const ScanlineSweep = styled.div`
  pointer-events: none;
  position: fixed;
  left: 0; width: 100%; height: 8px;
  z-index: 1;
  background: linear-gradient(to bottom, transparent, rgba(195,244,0,0.15), transparent);
  animation: ${scanlineSweep} 6s linear infinite;
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
  text-shadow: 0 0 12px rgba(255,0,255,0.6);
  animation: ${neonFlicker} 6s ease-in-out infinite;
`;

const Main = styled.main`
  position: relative;
  z-index: 10;
  padding: 8rem 1.5rem 6rem;
  min-height: 100vh;
  max-width: 900px;
  margin: 0 auto;
`;

const PageTitle = styled.h2<{ accent: string }>`
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-size: clamp(3rem, 9vw, 5.5rem);
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 1;
  color: ${C.onSurface};
  margin: 0 0 2rem;
  border-left: 8px solid ${({ accent }) => accent};
  padding-left: 1.5rem;
  animation: ${glitchText} 8s steps(1) infinite;

  span {
    color: ${({ accent }) => accent};
    text-shadow: 0 0 12px ${({ accent }) => accent}88;
  }
`;

const ResultCard = styled.div<{ accent: string }>`
  background: ${C.surface};
  border: 2px solid ${C.surfaceHigh};
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 8px 8px 0px ${({ accent }) => accent}44;
  animation: ${cardEntrance} 0.5s cubic-bezier(0.22,1,0.36,1) both;
`;

const SectionLabel = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${C.tertiary};
  margin: 0 0 1rem;
`;

const MotivationText = styled.p`
  font-family: 'Epilogue', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.5;
  color: ${C.onSurface};
  margin: 0;
  white-space: pre-wrap;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const MetaCard = styled.div<{ accent: string }>`
  background: ${C.surfaceHigh};
  padding: 1rem;
  border-bottom: 4px solid ${({ accent }) => accent};
`;

const MetaValue = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  margin: 0;
  color: ${C.onSurface};
`;

const EnrichmentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  @media (max-width: 800px) { grid-template-columns: 1fr; }
`;

const EnrichmentCard = styled.div<{ accent: string }>`
  background: ${C.surface};
  border: 2px solid ${C.surfaceHigh};
  border-left: 6px solid ${({ accent }) => accent};
  padding: 1rem;
`;

const MediaThumb = styled.img`
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border: 1px solid ${C.outline};
  margin-bottom: 0.75rem;
`;

const EnrichmentTitle = styled.p`
  margin: 0 0 0.4rem;
  font-family: 'Epilogue', sans-serif;
  font-weight: 700;
  color: ${C.onSurface};
`;

const EnrichmentSub = styled.p`
  margin: 0 0 0.75rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  color: ${C.onSurfaceVar};
`;

const EnrichmentLink = styled.a`
  display: inline-block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${C.secondary};
  text-decoration: none;
  &:hover { color: ${C.tertiary}; }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.button`
  background: ${C.primary};
  color: ${C.onPrimary};
  border: none;
  padding: 1rem 2.5rem;
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  cursor: pointer;
  box-shadow: 6px 6px 0px ${C.secondary};
  &:hover { animation: ${buttonShake} 0.3s steps(1) 1; box-shadow: 8px 8px 0px ${C.tertiary}; }
  &:active { transform: translate(4px,4px); box-shadow: 2px 2px 0px ${C.secondary}; }
`;

const SecondaryBtn = styled.button`
  background: transparent;
  border: 2px solid ${C.secondary};
  color: ${C.secondary};
  padding: 1rem 2.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  &:hover { background: ${C.secondary}22; }
  &:active { transform: translate(2px,2px); }
`;

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state?.result as MotivateResponse | undefined);
  const coach    = location.state?.coach ?? "coach1";
  const coachName = location.state?.coachName ?? "Coach";
  const accent   = coachAccent[coach] ?? C.primary;

  if (!result) {
    return (
      <>
        <Header><Logo>HUMOTIVATOREN</Logo></Header>
        <Main>
          <PageTitle accent={C.error}>INGEN<br /><span>MOTIVASJON.</span></PageTitle>
          <PrimaryBtn onClick={() => navigate("/")}>← TILBAKE</PrimaryBtn>
        </Main>
      </>
    );
  }

  return (
    <>
      <ScanlineOverlay />
      <ScanlineSweep />
      <Header>
        <Logo>HUMOTIVATOREN</Logo>
        <span className="material-symbols-outlined" style={{ color: C.onSurface, cursor: "pointer" }}>settings</span>
      </Header>

      <Main>
        <PageTitle accent={accent}>
          DIN<br /><span>MOTIVASJON.</span>
        </PageTitle>

        <ResultCard accent={accent}>
          <SectionLabel>FRA {coachName.toUpperCase()}</SectionLabel>
          <MotivationText>{result.motivation || "Ingen tekst mottatt."}</MotivationText>

          <MetaGrid>
            <MetaCard accent={accent}>
              <SectionLabel>COACH</SectionLabel>
              <MetaValue>{result.coach ?? coach}</MetaValue>
            </MetaCard>
            <MetaCard accent={accent}>
              <SectionLabel>SIKKERHETSNOTE</SectionLabel>
              <MetaValue>{result.safety_note ?? "ingen"}</MetaValue>
            </MetaCard>
          </MetaGrid>
        </ResultCard>

        <EnrichmentGrid>
          <EnrichmentCard accent={accent}>
            <SectionLabel>VIDEOBOOST</SectionLabel>
            {result.media?.thumbnail ? <MediaThumb src={result.media.thumbnail} alt={result.media.title || "YouTube thumbnail"} /> : null}
            <EnrichmentTitle>{result.media?.title || "Ingen video foresla"}</EnrichmentTitle>
            {result.media?.url ? (
              <EnrichmentLink href={result.media.url} target="_blank" rel="noreferrer">
                SE VIDEO
              </EnrichmentLink>
            ) : null}
          </EnrichmentCard>

          <EnrichmentCard accent={accent}>
            <SectionLabel>MUSIKKBOOST</SectionLabel>
            {result.spotify?.image ? <MediaThumb src={result.spotify.image} alt={result.spotify.title || "Spotify cover"} /> : null}
            <EnrichmentTitle>{result.spotify?.title || "Ingen latforslag"}</EnrichmentTitle>
            <EnrichmentSub>{result.spotify?.artist || ""}</EnrichmentSub>
            {result.spotify?.url ? (
              <EnrichmentLink href={result.spotify.url} target="_blank" rel="noreferrer">
                APNE I SPOTIFY
              </EnrichmentLink>
            ) : null}
          </EnrichmentCard>
        </EnrichmentGrid>

        <ButtonRow>
          <PrimaryBtn onClick={() => navigate(`/prompt/${coach}`)}>← NY OPPGAVE</PrimaryBtn>
          <SecondaryBtn onClick={() => navigate("/")}>BYTT COACH</SecondaryBtn>
        </ButtonRow>
      </Main>
    </>
  );
};

export default Result;
