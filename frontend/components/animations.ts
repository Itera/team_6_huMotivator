import { keyframes } from "styled-components";

// Neon flicker — simulates a faulty neon tube
export const neonFlicker = keyframes`
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow:
      0 0 6px #fff,
      0 0 10px #fff,
      0 0 20px #ff00ff,
      0 0 40px #ff00ff,
      0 0 60px #ff00ff;
    opacity: 1;
  }
  20%, 24%, 55% {
    text-shadow: none;
    opacity: 0.7;
  }
`;

// RGB glitch — splits color channels like a misaligned VHS tape
export const glitchText = keyframes`
  0%   { clip-path: inset(0 0 100% 0); transform: translate(0); opacity: 0; }
  5%   { clip-path: inset(20% 0 60% 0); transform: translate(-4px, 2px); color: #ff00ff; opacity: 1; }
  10%  { clip-path: inset(50% 0 30% 0); transform: translate(4px, -2px); color: #00daf3; opacity: 1; }
  15%  { clip-path: inset(80% 0 5%  0); transform: translate(-2px, 0);   color: #c3f400; opacity: 1; }
  20%  { clip-path: inset(0 0 100% 0);  transform: translate(0); opacity: 0; }
  100% { clip-path: inset(0 0 100% 0);  transform: translate(0); opacity: 0; }
`;

// CRT scanline sweep — bright bar moving down
export const scanlineSweep = keyframes`
  0%   { top: -8px;   opacity: 0.6; }
  50%  { opacity: 0.3; }
  100% { top: 100vh;  opacity: 0; }
`;

// Card entrance — slide up and fade in
export const cardEntrance = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Pulsing glow
export const glowPulse = keyframes`
  0%, 100% { box-shadow: 4px 4px 0px currentColor; }
  50%       { box-shadow: 4px 4px 0px currentColor, 0 0 20px currentColor; }
`;

// Drifting diagonal decoration
export const driftRight = keyframes`
  from { transform: rotate(-45deg) translateX(0); }
  to   { transform: rotate(-45deg) translateX(60px); }
`;

export const driftLeft = keyframes`
  from { transform: rotate(12deg) translateX(0); }
  to   { transform: rotate(12deg) translateX(-60px); }
`;

// EQ bar bounce — staggered heights for an equalizer effect
export const eqBounce = (min: number, max: number) => keyframes`
  0%, 100% { height: ${min}%; }
  50%       { height: ${max}%; }
`;

// VHS static noise flicker on hover
export const staticFlicker = keyframes`
  0%   { opacity: 1; }
  10%  { opacity: 0.85; filter: hue-rotate(45deg) contrast(1.5); }
  20%  { opacity: 1;    filter: none; }
  30%  { opacity: 0.9;  filter: hue-rotate(-30deg) saturate(2); }
  40%  { opacity: 1;    filter: none; }
  100% { opacity: 1; }
`;

// Button shake on hover
export const buttonShake = keyframes`
  0%, 100% { transform: translate(0, 0); }
  20%       { transform: translate(-3px, 1px); }
  40%       { transform: translate(3px, -1px); }
  60%       { transform: translate(-2px, 2px); }
  80%       { transform: translate(2px, -1px); }
`;

// Blinking cursor
export const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
`;
