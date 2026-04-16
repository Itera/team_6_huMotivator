import React, { useCallback, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";

const pulseRing = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(195,244,0,0.6); }
  70%  { box-shadow: 0 0 0 8px rgba(195,244,0,0); }
  100% { box-shadow: 0 0 0 0 rgba(195,244,0,0); }
`;

const eqBounce = keyframes`
  0%,100% { height: 4px; }
  25%     { height: 14px; }
  50%     { height: 8px; }
  75%     { height: 18px; }
`;

const Btn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid ${({ $active }) => ($active ? "#c3f400" : "#a4899d")};
  color:  ${({ $active }) => ($active ? "#c3f400" : "#a4899d")};
  padding: 0.35rem 0.85rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  ${({ $active }) => $active && css`animation: ${pulseRing} 1.2s ease-out infinite;`}
  &:hover { border-color: #c3f400; color: #c3f400; }
`;

const EQBar = styled.span<{ $delay: number; $active: boolean }>`
  display: inline-block;
  width: 3px;
  height: 4px;
  background: #c3f400;
  border-radius: 1px;
  animation: ${({ $active }) => ($active ? css`${eqBounce} 0.4s ease-in-out infinite` : "none")};
  animation-delay: ${({ $delay }) => $delay}s;
`;

const SynthPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/arpanauts.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }, [playing]);

  return (
    <Btn $active={playing} onClick={toggle} title={playing ? "Stop music" : "Play retro synth"}>
      <EQBar $active={playing} $delay={0} />
      <EQBar $active={playing} $delay={0.1} />
      <EQBar $active={playing} $delay={0.2} />
      <EQBar $active={playing} $delay={0.05} />
      {playing ? "ARPANAUTS" : "▶ ARPANAUTS"}
    </Btn>
  );
};

export default SynthPlayer;
