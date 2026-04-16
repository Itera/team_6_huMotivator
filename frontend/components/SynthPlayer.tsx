import React, { useCallback, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import * as Tone from "tone";

// ─── constants ────────────────────────────────────────────────────────────────
const BPM = 118;

// 8-bar Cm chord progression (Cm → Ab → Eb → Bb), each bar = 8 8th-note steps
const ARP_SEQUENCE = [
  // Cm
  "C4","Eb4","G4","Bb4","C5","Bb4","G4","Eb4",
  // Ab
  "Ab4","C5","Eb5","G5","Ab5","G5","Eb5","C5",
  // Eb
  "Eb4","G4","Bb4","D5","Eb5","D5","Bb4","G4",
  // Bb
  "Bb3","D4","F4","Ab4","Bb4","Ab4","F4","D4",
];

const BASS_SEQUENCE = [
  "C2","C2","C2","C2","C2","C2","C2","C2",
  "Ab1","Ab1","Ab1","Ab1","Ab1","Ab1","Ab1","Ab1",
  "Eb2","Eb2","Eb2","Eb2","Eb2","Eb2","Eb2","Eb2",
  "Bb1","Bb1","Bb1","Bb1","Bb1","Bb1","Bb1","Bb1",
];

// ─── styled components ────────────────────────────────────────────────────────
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
  ${({ $active }) =>
    $active &&
    css`
      animation: ${pulseRing} 1.2s ease-out infinite;
    `}
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

// ─── component ────────────────────────────────────────────────────────────────
const SynthPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const seqRef   = useRef<Tone.Sequence | null>(null);
  const bassRef  = useRef<Tone.Sequence | null>(null);
  const kickRef  = useRef<Tone.Sequence | null>(null);
  const hatRef   = useRef<Tone.Sequence | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const bassSnth = useRef<Tone.Synth | null>(null);
  const kickSnth = useRef<Tone.MembraneSynth | null>(null);
  const hatSnth  = useRef<Tone.MetalSynth | null>(null);

  const start = useCallback(async () => {
    await Tone.start();
    Tone.getTransport().bpm.value = BPM;

    // ── reverb / chorus FX ──────────────────────────────────────────────────
    const reverb  = new Tone.Reverb({ decay: 2.5, wet: 0.25 }).toDestination();
    const chorus  = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
    const limiter = new Tone.Limiter(-3).toDestination();

    // ── lead arpeggio synth (sawtooth → filtered) ────────────────────────────
    const filter = new Tone.Filter({ frequency: 3200, type: "lowpass" }).connect(reverb).connect(limiter);
    const lead   = new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope:   { attack: 0.01, decay: 0.12, sustain: 0.25, release: 0.4 },
      volume: -14,
    }).connect(filter).connect(chorus);
    synthRef.current = lead;

    let arpIdx = 0;
    const arpSeq = new Tone.Sequence(
      (time) => {
        lead.triggerAttackRelease(ARP_SEQUENCE[arpIdx % ARP_SEQUENCE.length], "8n", time);
        arpIdx++;
      },
      new Array(ARP_SEQUENCE.length).fill(0),
      "8n"
    );
    seqRef.current = arpSeq;

    // ── bass synth (square, an octave lower) ─────────────────────────────────
    const bassFilter = new Tone.Filter({ frequency: 600, type: "lowpass" }).connect(limiter);
    const bass = new Tone.Synth({
      oscillator: { type: "square" },
      envelope:   { attack: 0.02, decay: 0.3, sustain: 0.6, release: 0.8 },
      volume: -10,
    }).connect(bassFilter);
    bassSnth.current = bass;

    let bassIdx = 0;
    const bassSeq = new Tone.Sequence(
      (time) => {
        bass.triggerAttackRelease(BASS_SEQUENCE[bassIdx % BASS_SEQUENCE.length], "4n", time);
        bassIdx += 2; // one bass note per quarter note
      },
      new Array(BASS_SEQUENCE.length / 2).fill(0),
      "4n"
    );
    bassRef.current = bassSeq;

    // ── kick drum ─────────────────────────────────────────────────────────────
    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 8,
      envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.1 },
      volume: -8,
    }).connect(limiter);
    kickSnth.current = kick;

    // beats 1 and 3 in 4/4
    const kickSeq = new Tone.Sequence(
      (time, val) => { if (val) kick.triggerAttackRelease("C1", "8n", time); },
      [1, 0, 0, 0, 1, 0, 0, 0],
      "8n"
    );
    kickRef.current = kickSeq;

    // ── hi-hat ────────────────────────────────────────────────────────────────
    const hat = new Tone.MetalSynth({
      frequency: 400,
      envelope:  { attack: 0.001, decay: 0.08, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
      volume: -20,
    }).connect(limiter);
    hatSnth.current = hat;

    const hatSeq = new Tone.Sequence(
      (time, val) => { if (val) hat.triggerAttackRelease("8n", time); },
      [0, 1, 0, 1, 0, 1, 0, 1],
      "8n"
    );
    hatRef.current = hatSeq;

    // ── start all ─────────────────────────────────────────────────────────────
    arpSeq.start(0);
    bassSeq.start(0);
    kickSeq.start(0);
    hatSeq.start(0);
    Tone.getTransport().start();
    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    Tone.getTransport().stop();
    seqRef.current?.stop();
    bassRef.current?.stop();
    kickRef.current?.stop();
    hatRef.current?.stop();
    seqRef.current?.dispose();
    bassRef.current?.dispose();
    kickRef.current?.dispose();
    hatRef.current?.dispose();
    synthRef.current?.dispose();
    bassSnth.current?.dispose();
    kickSnth.current?.dispose();
    hatSnth.current?.dispose();
    seqRef.current = bassRef.current = kickRef.current = hatRef.current = null;
    synthRef.current = bassSnth.current = kickSnth.current = hatSnth.current = null;
    setPlaying(false);
  }, []);

  const toggle = () => (playing ? stop() : start());

  return (
    <Btn $active={playing} onClick={toggle} title={playing ? "Stop music" : "Play retro synth"}>
      <EQBar $active={playing} $delay={0} />
      <EQBar $active={playing} $delay={0.1} />
      <EQBar $active={playing} $delay={0.2} />
      <EQBar $active={playing} $delay={0.05} />
      {playing ? "SYNTHWAVE" : "▶ SYNTHWAVE"}
    </Btn>
  );
};

export default SynthPlayer;
