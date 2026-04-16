import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useTheme } from "../components/ThemeProvider";
import { getModels, motivate } from "../services/api";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  primary:         "#ff7cf5",
  secondary:       "#c3f400",
  tertiary:        "#c1fffe",
  bg:              "#0e0e0e",
  surface:         "#1a1a1a",
  surfaceLow:      "#131313",
  surfaceHigh:     "#20201f",
  surfaceHighest:  "#262626",
  onSurface:       "#ffffff",
  onSurfaceVar:    "#adaaaa",
  outlineVar:      "#484847",
  onPrimary:       "#580058",
  onSecondary:     "#455900",
};

// ─── Animations ──────────────────────────────────────────────────────────────
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────
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

// ─── Hero ─────────────────────────────────────────────────────────────────────
const HeroSection = styled.section`
  margin-bottom: 3rem;
  border-left: 8px solid ${C.secondary};
  padding: 1rem 0 1rem 1.5rem;
`;

const HeroTitle = styled.h2`
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: clamp(3rem, 10vw, 6rem);
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: -0.05em;
  margin: 0 0 1.5rem 0;
  color: ${C.onSurface};
`;

const HeroAccent = styled.span`
  color: ${C.secondary};
  text-shadow: 4px 4px 0px #580058;
`;

const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
`;

const StatusCard = styled.div`
  background: ${C.surfaceHigh};
  padding: 1rem;
  border: 2px solid rgba(255, 124, 245, 0.2);
  flex: 1;
  min-width: 200px;
`;

const StatusLabel = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${C.primary};
  margin: 0 0 0.25rem 0;
`;

const StatusValue = styled.p`
  font-family: 'Epilogue', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  margin: 0;
`;

const AlertBadge = styled.div`
  background: ${C.secondary};
  color: ${C.onSecondary};
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ─── Bento Grid ───────────────────────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(12, 1fr);
  }
`;

// ─── Input Card ───────────────────────────────────────────────────────────────
const InputCard = styled.div`
  background: ${C.surface};
  border: 2px solid rgba(72, 72, 71, 0.3);
  padding: 2rem;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    grid-column: span 8;
  }

  &::before {
    content: 'ROCK';
    position: absolute;
    top: 0; right: 0;
    padding: 0.5rem;
    opacity: 0.07;
    font-family: 'Epilogue', sans-serif;
    font-weight: 900;
    font-size: 4rem;
    transform: rotate(-12deg);
    pointer-events: none;
    color: ${C.onSurface};
  }
`;

const InputLabel = styled.label`
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${C.tertiary};
  margin-bottom: 1.5rem;
`;

const InputWrapper = styled.div`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 0; height: 4px;
    background: ${C.tertiary};
    box-shadow: 0 0 15px ${C.tertiary};
    transition: width 0.5s;
  }

  &:focus-within::after {
    width: 100%;
  }
`;

const TaskInput = styled.input`
  width: 100%;
  background: ${C.surfaceHighest};
  border: none;
  border-bottom: 4px solid ${C.outlineVar};
  color: ${C.onSurface};
  font-family: 'Epilogue', sans-serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  text-transform: uppercase;
  padding: 1.5rem 0;
  outline: none;
  transition: border-color 0.3s;

  &::placeholder {
    opacity: 0.2;
  }

  &:focus {
    border-bottom-color: ${C.tertiary};
  }
`;

const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
`;

interface ChipProps { selected: boolean; }
const Chip = styled.button<ChipProps>`
  background: ${({ selected }) => selected ? "#506600" : C.surfaceLow};
  border: ${({ selected }) => selected ? `2px solid ${C.secondary}` : `1px solid ${C.outlineVar}`};
  color: ${({ selected }) => selected ? C.secondary : C.onSurfaceVar};
  padding: 0.5rem 1rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${C.secondary};
    color: ${C.secondary};
  }
`;

// ─── Motivate Button ──────────────────────────────────────────────────────────
const MotivateCard = styled.button`
  background: ${C.primary};
  color: ${C.onPrimary};
  border: none;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  box-shadow: 8px 8px 0px ${C.secondary};
  transition: transform 0.15s, box-shadow 0.15s;
  width: 100%;

  @media (min-width: 768px) {
    grid-column: span 4;
  }

  &:hover:not(:disabled) {
    transform: scale(1.02);
  }
  &:active:not(:disabled) {
    transform: scale(0.95);
    box-shadow: 4px 4px 0px ${C.secondary};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MotivateIcon = styled.span`
  font-size: 3.5rem;
  font-variation-settings: 'FILL' 1;
  transition: transform 0.2s;

  ${MotivateCard}:hover & {
    transform: rotate(12deg);
  }
`;

const MotivateLabel = styled.span`
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: 2rem;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.1;
`;

const LoadingLabel = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  animation: ${pulse} 1s infinite;
`;

// ─── Stats Card ───────────────────────────────────────────────────────────────
const StatsCard = styled.div`
  background: ${C.surfaceHigh};
  padding: 1.5rem;
  border-bottom: 8px solid ${C.secondary};

  @media (min-width: 768px) {
    grid-column: span 4;
  }
`;

const StatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const StatsTitle = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${C.secondary};
  margin: 0;
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 6rem;
  margin-bottom: 1rem;
`;

interface BarProps { height: string; }
const Bar = styled.div<BarProps>`
  flex: 1;
  background: ${C.secondary};
  height: ${({ height }) => height};
`;

const StatsDesc = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  color: ${C.onSurfaceVar};
  line-height: 1.5;
  margin: 0;
`;

// ─── Quote Card ───────────────────────────────────────────────────────────────
const QuoteCard = styled.div`
  background: ${C.surfaceHighest};
  padding: 2rem;
  display: flex;
  align-items: flex-end;
  min-height: 200px;
  border-left: 4px solid ${C.primary};

  @media (min-width: 768px) {
    grid-column: span 8;
  }
`;

const QuoteText = styled.p`
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: -0.03em;
  margin: 0 0 0.5rem 0;
`;

const QuoteAttrib = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${C.primary};
  margin: 0;
`;

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = styled.footer`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(72, 72, 71, 0.2);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  opacity: 0.4;
  transition: opacity 0.5s, filter 0.5s;
  filter: grayscale(1);

  &:hover {
    opacity: 1;
    filter: grayscale(0);
  }
`;

const FooterCopy = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0;
`;

const FooterIcons = styled.div`
  display: flex;
  gap: 2rem;
`;

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
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
  ${({ active }) => active ? `outline: 2px solid ${C.tertiary};` : ""}

  &:hover {
    background: ${C.surface};
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

// ─── Coaches ──────────────────────────────────────────────────────────────────
const coaches = [
  { key: "military",    label: "#MILITÆRLEDER" },
  { key: "psychologist",label: "#PSYKOLOG"     },
  { key: "artist",      label: "#KUNSTNER"     },
];

const barHeights = ["80%", "40%", "95%", "60%", "30%", "85%", "50%"];

// ─── Component ────────────────────────────────────────────────────────────────
const Home: React.FC = () => {
  const [task, setTask]               = useState("");
  const [loading, setLoading]         = useState(false);
  const [selectedCoach, setSelectedCoach] = useState("military");
  const [selectedModel]               = useState("llama3.2");
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const handleCoachSelect = (key: string) => {
    setSelectedCoach(key);
    setTheme(key);
  };

  const handleMotivate = async () => {
    if (!task || loading) return;
    setLoading(true);
    try {
      const response = await motivate(task, selectedModel);
      navigate("/result", { state: { result: response, coach: selectedCoach } });
    } catch {
      alert("Klarte ikke å hente motivasjon. Prøv igjen!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span className="material-symbols-outlined" style={{ color: C.primary, cursor: "pointer" }}>menu</span>
          <Logo>HUMOTIVATOREN</Logo>
        </div>
        <span className="material-symbols-outlined" style={{ color: C.primary, cursor: "pointer" }}>electric_bolt</span>
      </Header>

      <Main>
        <HeroSection>
          <HeroTitle>
            SHUT UP &amp; <br />
            <HeroAccent>PERFORM.</HeroAccent>
          </HeroTitle>
          <StatusRow>
            <StatusCard>
              <StatusLabel>SYSTEM STATUS</StatusLabel>
              <StatusValue>66% AV TÅLMODIGHETEN DIN ER BRUKT OPP.</StatusValue>
            </StatusCard>
            <AlertBadge>
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>warning</span>
              KRITISKE NIVÅER AV APATI OPPDAGET
            </AlertBadge>
          </StatusRow>
        </HeroSection>

        <Grid>
          <InputCard>
            <InputLabel htmlFor="task">HVA ER DITT OPPDRAG, REBELL?</InputLabel>
            <InputWrapper>
              <TaskInput
                id="task"
                type="text"
                placeholder="F.EKS. ØDELEGG DETTE REGNEARKET..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMotivate()}
              />
            </InputWrapper>
            <ChipsRow>
              {coaches.map((c) => (
                <Chip
                  key={c.key}
                  selected={selectedCoach === c.key}
                  onClick={() => handleCoachSelect(c.key)}
                  type="button"
                >
                  {c.label}
                </Chip>
              ))}
            </ChipsRow>
          </InputCard>

          <MotivateCard onClick={handleMotivate} disabled={loading || !task} type="button">
            <MotivateIcon className="material-symbols-outlined">bolt</MotivateIcon>
            {loading
              ? <LoadingLabel>LASTER...</LoadingLabel>
              : <MotivateLabel>MOTIVER<br />MEG</MotivateLabel>
            }
          </MotivateCard>

          <StatsCard>
            <StatsHeader>
              <StatsTitle>VOLUMETER</StatsTitle>
              <span className="material-symbols-outlined" style={{ color: C.secondary }}>graphic_eq</span>
            </StatsHeader>
            <BarChart>
              {barHeights.map((h, i) => <Bar key={i} height={h} />)}
            </BarChart>
            <StatsDesc>
              Innsatsen din er på <strong style={{ color: "#fff" }}>LEGENDARISK</strong> nivå.
              La ikke kjedelige oppgaver dempe lyden.
            </StatsDesc>
          </StatsCard>

          <QuoteCard>
            <div>
              <QuoteText>"SØVN ER FOR DE SVAKE."</QuoteText>
              <QuoteAttrib>— UKJENT ROADIE, 1984</QuoteAttrib>
            </div>
          </QuoteCard>
        </Grid>

        <Footer>
          <FooterCopy>© 198X HUMOTIVATOREN INC. | INGEN REFUSJON FOR TAPT AMBISJON.</FooterCopy>
          <FooterIcons>
            <span className="material-symbols-outlined">album</span>
            <span className="material-symbols-outlined">podium</span>
            <span className="material-symbols-outlined">stadium</span>
          </FooterIcons>
        </Footer>
      </Main>

      <BottomNav>
        <NavItem href="#">
          <span className="material-symbols-outlined">confirmation_number</span>
          <NavLabel>TOUR</NavLabel>
        </NavItem>
        <NavItem active href="#">
          <span className="material-symbols-outlined">speaker_group</span>
          <NavLabel>STAGES</NavLabel>
        </NavItem>
        <NavItem href="#">
          <span className="material-symbols-outlined">graphic_eq</span>
          <NavLabel>VIBES</NavLabel>
        </NavItem>
        <NavItem href="#">
          <span className="material-symbols-outlined">badge</span>
          <NavLabel>PASS</NavLabel>
        </NavItem>
      </BottomNav>
    </>
  );
};

export default Home;
