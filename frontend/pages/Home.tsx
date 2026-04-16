import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  neonFlicker, glitchText, scanlineSweep, cardEntrance,
  driftRight, driftLeft, eqBounce, staticFlicker, glowPulse,
} from "../components/animations";
import SynthPlayer from "../components/SynthPlayer";

const C = {
  bg:              "#131313",
  bgDeep:          "#0e0e0e",
  surface:         "#1f1f1f",
  surfaceHigh:     "#2a2a2a",
  surfaceLow:      "#1b1b1b",
  primary:         "#ff00ff",
  onPrimary:       "#5b005b",
  secondary:       "#c3f400",
  onSecondary:     "#283500",
  tertiary:        "#00daf3",
  onTertiary:      "#00363d",
  error:           "#ffb4ab",
  onError:         "#690005",
  errorContainer:  "#93000a",
  onSurface:       "#e2e2e2",
  onSurfaceVar:    "#dcbed4",
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

const ScanlineSweep = styled.div`
  pointer-events: none;
  position: fixed;
  left: 0; width: 100%; height: 8px;
  z-index: 1;
  background: linear-gradient(to bottom, transparent, rgba(195,244,0,0.15), transparent);
  animation: ${scanlineSweep} 6s linear infinite;
`;

const DecoLine1 = styled.div`
  position: fixed;
  top: 25%;
  right: -3rem;
  width: 16rem;
  height: 0.5rem;
  background: ${C.primary};
  opacity: 0.15;
  pointer-events: none;
  animation: ${driftRight} 8s ease-in-out infinite alternate;
`;
const DecoLine2 = styled.div`
  position: fixed;
  bottom: 25%;
  left: -3rem;
  width: 24rem;
  height: 1rem;
  background: ${C.tertiary};
  opacity: 0.08;
  pointer-events: none;
  animation: ${driftLeft} 10s ease-in-out infinite alternate;
`;

const Header = styled.header`
  position: fixed;
  top: 0; left: 0; width: 100%;
  z-index: 50;
  height: 3.5rem;
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
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  color: ${C.primary};
  margin: 0;
  animation: ${neonFlicker} 8s infinite;
  cursor: default;
`;

const HeaderNav = styled.nav`
  display: none;
  gap: 1.5rem;
  @media (min-width: 768px) { display: flex; }
`;

const NavLink = styled.a<{ active?: boolean }>`
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: ${({ active }) => active ? C.secondary : C.onSurface};
  text-decoration: none;
  ${({ active }) => active ? `border-bottom: 4px solid ${C.secondary};` : ""}
  &:hover { color: ${C.primary}; }
`;

const Sidebar = styled.aside`
  display: none;
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0; top: 0;
    height: 100vh;
    width: 13rem;
    padding-top: 4rem;
    background: ${C.bgDeep};
    border-right: 4px solid ${C.surface};
    z-index: 40;
  }
`;

const SidebarSection = styled.div`
  padding: 0 1.5rem 2rem;
`;
const SidebarLabel = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${C.tertiary};
  margin: 0 0 0.25rem;
`;
const SidebarSub = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.6rem;
  opacity: 0.6;
  margin: 0;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SidebarItem = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  background: ${({ active }) => active ? C.primary : "transparent"};
  color: ${({ active }) => active ? C.onPrimary : C.onSurface};
  opacity: ${({ active }) => active ? 1 : 0.65};
  transition: none;
  &:hover { background: ${C.surfaceHigh}; opacity: 1; border-left: 8px solid ${C.tertiary}; }
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding: 1.5rem;
`;

const EQBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 2rem;
  padding: 0 1.5rem;
  margin-bottom: 1rem;
`;

interface EQBarProps { h1: number; h2: number; dur: string; }
const EQBar = styled.div<EQBarProps>`
  flex: 1;
  background: ${C.secondary};
  animation: ${({ h1, h2 }) => eqBounce(h1, h2)} ${({ dur }) => dur} ease-in-out infinite alternate;
`;

const DisruptBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: 2px solid ${C.secondary};
  color: ${C.secondary};
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: pointer;
  &:active { transform: scale(0.97); }
`;

const Main = styled.main`
  position: relative;
  z-index: 10;
  padding: 4.5rem 1.5rem 0.5rem;
  min-height: 100vh;
  @media (min-width: 1024px) { padding-left: calc(13rem + 1.5rem); }
`;

const PageHeader = styled.div`
  margin-bottom: 1rem;
`;

const PageTitle = styled.h2`
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-size: clamp(2rem, 5vw, 3rem);
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 1;
  margin: 0 0 0.5rem;
  color: ${C.onSurface};
  position: relative;

  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0;
    color: ${C.primary};
    animation: ${glitchText} 6s steps(1) infinite;
    pointer-events: none;
  }
`;
const TitleAccent = styled.span`
  color: ${C.primary};
  text-shadow: 0 0 12px rgba(255,0,255,0.5);
`;

const SubRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const SubLine = styled.div`
  width: 6rem;
  height: 4px;
  background: ${C.secondary};
`;
const SubText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: ${C.secondary};
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
`;

interface CardAccent { accent: string; shadowHover: string; delay?: string; }

const CoachCard = styled.div<CardAccent>`
  position: relative;
  background: ${C.surface};
  border: 2px solid transparent;
  cursor: pointer;
  box-shadow: 12px 12px 0px ${C.surfaceHigh};
  animation: ${cardEntrance} 0.5s cubic-bezier(0,1,0.5,1) both;
  animation-delay: ${({ delay }) => delay ?? "0s"};

  &:hover {
    border-color: ${({ accent }) => accent};
    box-shadow: 16px 16px 0px ${({ shadowHover }) => shadowHover};
    animation: ${staticFlicker} 0.4s steps(1) 1;
  }
  &:active { transform: translate(4px, 4px); box-shadow: 8px 8px 0px ${({ shadowHover }) => shadowHover}; }
`;

const CardImageBox = styled.div`
  height: 120px;
  overflow: hidden;
  background: ${C.surfaceLow};
  position: relative;
`;

const CardImagePlaceholder = styled.div<{ color: string }>`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${({ color }) => color}22 0%, ${C.bgDeep} 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-size: 3.5rem;
  color: ${({ color }) => color};
  opacity: 0.4;
  text-shadow: 0 0 40px currentColor;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, ${C.bg} 0%, transparent 60%);
  opacity: 0.5;
`;

const Badge = styled.div<{ color: string; textColor: string }>`
  position: absolute;
  top: 1rem; left: 1rem;
  background: ${({ color }) => color};
  color: ${({ textColor }) => textColor};
  padding: 0.25rem 1rem;
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  transform: skewX(-10deg);
`;

const CardBody = styled.div`
  padding: 0.75rem 1rem;
`;

const CoachName = styled.h3`
  font-family: 'Epilogue', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  color: ${C.onSurface};
  margin: 0 0 0.35rem;
`;

const CoachDesc = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  line-height: 1.4;
  color: ${C.onSurface};
  opacity: 0.8;
  margin: 0;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.08);
`;

const LevelLabel = styled.span<{ color: string }>`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: ${({ color }) => color};
`;

const FooterIcon = styled.span<{ color: string }>`
  font-size: 1.25rem;
  color: ${({ color }) => color};
`;

const BottomNav = styled.nav`
  position: fixed;
  bottom: 0; left: 0; width: 100%;
  z-index: 50;
  display: flex;
  justify-content: space-around;
  height: 4rem;
  background: ${C.bg};
  border-top: 2px solid ${C.surfaceHigh};
  box-shadow: 0 -10px 20px rgba(0,0,0,0.5);
  @media (min-width: 1024px) { display: none; }
`;

const BottomNavItem = styled.a<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 0.2rem;
  text-decoration: none;
  background: ${({ active }) => active ? C.secondary : "transparent"};
  color: ${({ active }) => active ? C.onSecondary : C.onSurface};
  &:active { transform: scale(0.95); }
`;

const BottomNavLabel = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const coaches = [
  {
    key: "coach1",
    name: "Drill Sergeant",
    desc: "No shortcuts. Pure discipline. High voltage.",
    badge: "MILITARY",
    badgeColor: C.errorContainer,
    badgeText: "#fff",
    accent: C.error,
    shadowHover: "#93000a",
    level: "LEVEL: BRUTAL",
    levelColor: C.error,
    icon: "military_tech",
    symbol: "⚔",
  },
  {
    key: "coach2",
    name: "The Zen Psych",
    desc: "Listens to your excuses — then calmly dismantles them.",
    badge: "EMPATHY",
    badgeColor: C.primary,
    badgeText: C.onPrimary,
    accent: C.primary,
    shadowHover: "#510051",
    level: "LEVEL: TRANQUIL",
    levelColor: C.primary,
    icon: "psychology",
    symbol: "☯",
  },
  {
    key: "coach3",
    name: "Crystal Mystic",
    desc: "Sacred geometry. Ethereal gains. Align your chakras.",
    badge: "SPIRIT",
    badgeColor: C.tertiary,
    badgeText: C.onTertiary,
    accent: C.tertiary,
    shadowHover: "#004f58",
    level: "LEVEL: ETHEREAL",
    levelColor: C.tertiary,
    icon: "change_history",
    symbol: "✦",
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <ScanlineOverlay />
      <ScanlineSweep />
      <DecoLine1 />
      <DecoLine2 />

      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Logo>HUMOTIVATOREN</Logo>
          <HeaderNav>
            <NavLink href="#">AMPLIFY</NavLink>
            <NavLink href="#" active>STATION</NavLink>
            <NavLink href="#">FREQUENCIES</NavLink>
          </HeaderNav>
        </div>
        <span className="material-symbols-outlined" style={{ color: C.onSurface, cursor: "pointer" }}>settings</span>
        <SynthPlayer />
      </Header>

      <Sidebar>
        <SidebarSection>
          <SidebarLabel>VOLTAGE</SidebarLabel>
          <SidebarSub>ANALOG SIGNAL</SidebarSub>
        </SidebarSection>
        <SidebarNav>
          <SidebarItem href="#" active>
            <span className="material-symbols-outlined">equalizer</span> AMPLIFY
          </SidebarItem>
          <SidebarItem href="#">
            <span className="material-symbols-outlined">blur_on</span> STATIC
          </SidebarItem>
          <SidebarItem href="#">
            <span className="material-symbols-outlined">analytics</span> FREQUENCIES
          </SidebarItem>
          <SidebarItem href="#">
            <span className="material-symbols-outlined">inventory_2</span> ARCHIVE
          </SidebarItem>
        </SidebarNav>
        <SidebarFooter>
          <EQBars>
            <EQBar h1={20} h2={90} dur="0.4s" />
            <EQBar h1={50} h2={70} dur="0.6s" />
            <EQBar h1={10} h2={100} dur="0.3s" />
            <EQBar h1={40} h2={80} dur="0.5s" />
            <EQBar h1={30} h2={60} dur="0.7s" />
            <EQBar h1={60} h2={95} dur="0.45s" />
          </EQBars>
          <DisruptBtn>DISRUPT</DisruptBtn>
        </SidebarFooter>
      </Sidebar>

      <Main>
        <PageHeader>
          <PageTitle data-text="VELG COACH">
            VELG <TitleAccent>COACH</TitleAccent>
          </PageTitle>
          <SubRow>
            <SubLine />
            <SubText>TRANSMISSION ENCRYPTED // SELECT YOUR DISRUPTOR</SubText>
          </SubRow>
        </PageHeader>

        <Grid>
          {coaches.map((coach, i) => (
            <CoachCard
              key={coach.key}
              accent={coach.accent}
              shadowHover={coach.shadowHover}
              delay={`${i * 0.12}s`}
              onClick={() => navigate(`/prompt/${coach.key}`)}
            >
              <CardImageBox>
                <CardImagePlaceholder color={coach.accent}>
                  {coach.symbol}
                </CardImagePlaceholder>
                <GradientOverlay />
                <Badge color={coach.badgeColor} textColor={coach.badgeText}>
                  {coach.badge}
                </Badge>
              </CardImageBox>
              <CardBody>
                <CoachName>{coach.name}</CoachName>
                <CoachDesc>{coach.desc}</CoachDesc>
                <CardFooter>
                  <LevelLabel color={coach.levelColor}>{coach.level}</LevelLabel>
                  <FooterIcon className="material-symbols-outlined" color={coach.levelColor}>
                    {coach.icon}
                  </FooterIcon>
                </CardFooter>
              </CardBody>
            </CoachCard>
          ))}
        </Grid>
      </Main>

      <BottomNav>
        <BottomNavItem href="#"><span className="material-symbols-outlined">sensors</span><BottomNavLabel>LIVE</BottomNavLabel></BottomNavItem>
        <BottomNavItem href="#" active><span className="material-symbols-outlined">ssid_chart</span><BottomNavLabel>DATA</BottomNavLabel></BottomNavItem>
        <BottomNavItem href="#"><span className="material-symbols-outlined">tune</span><BottomNavLabel>MIX</BottomNavLabel></BottomNavItem>
        <BottomNavItem href="#"><span className="material-symbols-outlined">settings_input_component</span><BottomNavLabel>GEAR</BottomNavLabel></BottomNavItem>
      </BottomNav>
    </>
  );
};

export default Home;
