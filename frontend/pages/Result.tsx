import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const C = {
  primary:        "#ff7cf5",
  secondary:      "#c3f400",
  tertiary:       "#c1fffe",
  bg:             "#0e0e0e",
  surface:        "#1a1a1a",
  surfaceLow:     "#131313",
  surfaceHigh:    "#20201f",
  surfaceHighest: "#262626",
  onSurface:      "#ffffff",
  onSurfaceVar:   "#adaaaa",
  outlineVar:     "#484847",
  onPrimary:      "#580058",
  onSecondary:    "#455900",
};

const Header = styled.header`
  position: fixed;
  top: 0; left: 0; width: 100%;
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
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: 1.75rem;
  text-transform: uppercase;
  letter-spacing: -0.05em;
  color: ${C.primary};
  margin: 0;
  text-shadow: 0 0 10px rgba(255, 124, 245, 0.8);
`;

const Main = styled.main`
  padding: 6rem 1.5rem 8rem;
  max-width: 1024px;
  margin: 0 auto;
`;

const PageTitle = styled.h2`
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: clamp(2.5rem, 8vw, 5rem);
  text-transform: uppercase;
  letter-spacing: -0.05em;
  color: ${C.onSurface};
  border-left: 8px solid ${C.primary};
  padding-left: 1.5rem;
  margin: 0 0 2rem 0;

  span { color: ${C.primary}; text-shadow: 4px 4px 0px #580058; }
`;

const ResultCard = styled.div`
  background: ${C.surface};
  border: 2px solid rgba(72, 72, 71, 0.3);
  padding: 2.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 30px rgba(255, 124, 245, 0.15);
`;

const SectionLabel = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${C.tertiary};
  margin: 0 0 0.75rem 0;
`;

const MotivationText = styled.p`
  font-family: 'Epilogue', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.4;
  margin: 0;
  color: ${C.onSurface};
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MetaCard = styled.div`
  background: ${C.surfaceHigh};
  padding: 1rem;
  border-bottom: 4px solid ${C.secondary};
`;

const MetaValue = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  margin: 0;
  color: ${C.onSurface};
`;

const BackButton = styled.button`
  background: ${C.primary};
  color: ${C.onPrimary};
  border: none;
  padding: 1.25rem 3rem;
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  cursor: pointer;
  box-shadow: 6px 6px 0px ${C.secondary};
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover {
    transform: scale(1.02);
  }
  &:active {
    transform: scale(0.97);
    box-shadow: 3px 3px 0px ${C.secondary};
  }
`;

const BottomNav = styled.nav`
  position: fixed;
  bottom: 0; left: 0; width: 100%;
  z-index: 50;
  display: flex;
  justify-content: space-around;
  height: 5rem;
  background: ${C.bg};
  border-top: 4px solid ${C.primary};
  box-shadow: 0 -4px 20px rgba(255, 124, 245, 0.4);
`;

interface NavItemProps { active?: boolean; }
const NavItem = styled.a<NavItemProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 0.25rem;
  text-decoration: none;
  cursor: pointer;
  background: ${({ active }) => active ? C.secondary : "transparent"};
  color: ${({ active }) => active ? C.onSecondary : C.primary};
  opacity: ${({ active }) => active ? 1 : 0.6};
  transition: all 0.2s;

  &:hover {
    background: #1a1a1a;
    opacity: 1;
  }
`;

const NavLabel = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <>
        <Header>
          <Logo>HUMOTIVATOREN</Logo>
        </Header>
        <Main>
          <PageTitle>INGEN<br /><span>MOTIVASJON.</span></PageTitle>
          <BackButton onClick={() => navigate("/")}>← PRØV IGJEN</BackButton>
        </Main>
      </>
    );
  }

  return (
    <>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span className="material-symbols-outlined" style={{ color: "#ff7cf5", cursor: "pointer" }}>menu</span>
          <Logo>HUMOTIVATOREN</Logo>
        </div>
        <span className="material-symbols-outlined" style={{ color: "#ff7cf5", cursor: "pointer" }}>electric_bolt</span>
      </Header>

      <Main>
        <PageTitle>DIN<br /><span>MOTIVASJON.</span></PageTitle>

        <ResultCard>
          <SectionLabel>MOTIVASJON</SectionLabel>
          <MotivationText>{result.motivation || "Ingen tekst mottatt."}</MotivationText>

          <MetaGrid>
            <MetaCard>
              <SectionLabel>MODELL</SectionLabel>
              <MetaValue>{result.model_used || "ukjent"}</MetaValue>
            </MetaCard>
            <MetaCard>
              <SectionLabel>SIKKERHETSNOTE</SectionLabel>
              <MetaValue>{result.safety_note || "ingen"}</MetaValue>
            </MetaCard>
          </MetaGrid>
        </ResultCard>

        <BackButton onClick={() => navigate("/")}>← FÅ NY INSPIRASJON</BackButton>
      </Main>

      <BottomNav>
        <NavItem href="#"><span className="material-symbols-outlined">confirmation_number</span><NavLabel>TOUR</NavLabel></NavItem>
        <NavItem active href="#"><span className="material-symbols-outlined">speaker_group</span><NavLabel>STAGES</NavLabel></NavItem>
        <NavItem href="#"><span className="material-symbols-outlined">graphic_eq</span><NavLabel>VIBES</NavLabel></NavItem>
        <NavItem href="#"><span className="material-symbols-outlined">badge</span><NavLabel>PASS</NavLabel></NavItem>
      </BottomNav>
    </>
  );
};

export default Result;
