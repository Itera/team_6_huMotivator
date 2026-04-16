import React, { useCallback, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import * as Tone from "tone";

// ─── constants ────────────────────────────────────────────────────────────────
const BPM = 132;

// 16th-note arpeggio — Cm → Ab → Eb → Bb (4 bars × 16 steps)
const ARP_SEQUENCE = [
  // Cm
  "C4","G4","Eb4","Bb4","C5","G4","Eb5","Bb4",
  "C4","G4","Eb4","C5","Bb4","G4","Eb4","C4",
  // Ab
  "Ab4","Eb5","C5","Ab4","Eb5","C5","Ab5","Eb5",
  "Ab4","C5","Eb5","Ab4","G5","Eb5","C5","Ab4",
  // Eb
  "Eb4","Bb4","G4","Eb5","Bb4","G5","Eb4","Bb4",
  "Eb5","G4","Bb4","Eb4","D5","Bb4","G4","Eb4",
  // Bb
  "Bb3","F4","D4","Bb4","F4","D5","Bb3","F4",
  "Bb4","D4","F4","Bb3","Ab4","F4","D4","Bb3",
];

// Bass hits on every beat root
const BASS_BEATS = ["C2","C2","C2","C2","Ab1","Ab1","Ab1","Ab1",
                    "Eb2","Eb2","Eb2","Eb2","Bb1","Bb1","Bb1","Bb1"];

// Pad chords — one per bar (PolySynth notes)
const PAD_CHORDS = [
  ["C3","Eb3","G3","Bb3"],
  ["Ab2","C3","Eb3","G3"],
  ["Eb3","G3","Bb3","D4"],
  ["Bb2","D3","F3","Ab3"],
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
  const snareRef = useRef<Tone.Sequence | null>(null);
  const padRef   = useRef<Tone.Sequence | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const bassSnth = useRef<Tone.Synth | null>(null);
  const kickSnth = useRef<Tone.MembraneSynth | null>(null);
  const hatSnth  = useRef<Tone.MetalSynth | null>(null);
  const snareSnth= useRef<Tone.NoiseSynth | null>(null);
  const padSnth  = useRef<Tone.PolySynth | null>(null);

  const start = useCallback(async () => {
    await Tone.start();
    Tone.getTransport().bpm.value = BPM;

    // ── master chain: compressor → limiter ──────────────────────────────────
    const comp    = new Tone.Compressor({ threshold: -18, ratio: 6, attack: 0.003, release: 0.1 }).toDestination();
    const limiter = new Tone.Limiter(-2).connect(comp);

    // ── FX ──────────────────────────────────────────────────────────────────
    const reverb  = new Tone.Reverb({ decay: 1.8, wet: 0.2 }).connect(limiter);
    const chorus  = new Tone.Chorus(3, 2, 0.4).connect(limiter).start();
    const distort = new Tone.Distortion(0.35).connect(limiter);

    // ── lead arpeggio: sawtooth, 16th notes, filtered ───────────────────────
    const leadFilter = new Tone.Filter({ frequency: 4800, type: "lowpass", rolloff: -24 }).connect(reverb).connect(chorus);
    const lead = new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope:   { attack: 0.005, decay: 0.08, sustain: 0.2, release: 0.25 },
      volume: -12,
    }).connect(leadFilter);
    synthRef.current = lead;

    let arpIdx = 0;
    const arpSeq = new Tone.Sequence(
      (time) => { lead.triggerAttackRelease(ARP_SEQUENCE[arpIdx++ % ARP_SEQUENCE.length], "16n", time); },
      new Array(ARP_SEQUENCE.length).fill(0), "16n"
    );
    seqRef.current = arpSeq;

    // ── bass: square wave + distortion, punchy short decay ──────────────────
    const bassFilter = new Tone.Filter({ frequency: 500, type: "lowpass" }).connect(distort).connect(limiter);
    const bass = new Tone.Synth({
      oscillator: { type: "square" },
      envelope:   { attack: 0.005, decay: 0.15, sustain: 0.5, release: 0.3 },
      volume: -6,
    }).connect(bassFilter);
    bassSnth.current = bass;

    let bassIdx = 0;
    const bassSeq = new Tone.Sequence(
      (time) => { bass.triggerAttackRelease(BASS_BEATS[bassIdx++ % BASS_BEATS.length], "8n", time); },
      new Array(BASS_BEATS.length).fill(0), "4n"
    );
    bassRef.current = bassSeq;

    // ── pad: polyphonic, detuned, swells each bar ────────────────────────────
    const padReverb = new Tone.Reverb({ decay: 4, wet: 0.6 }).connect(limiter);
    const pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope:   { attack: 0.4, decay: 0.3, sustain: 0.8, release: 2 },
      volume: -20,
    }).connect(padReverb);
    padSnth.current = pad;

    let padIdx = 0;
    const padSeq = new Tone.Sequence(
      (time) => {
        const chord = PAD_CHORDS[padIdx % PAD_CHORDS.length];
        pad.triggerAttackRelease(chord, "1m", time);
        padIdx++;
      },
      new Array(PAD_CHORDS.length).fill(0), "1m"
    );
    padRef.current = padSeq;

    // ── kick: tight and punchy ────────────────────────────────────────────────
    const kick = new Tone.MembraneSynth({
      pitchDecay:  0.04,
      octaves:     10,
      envelope:    { attack: 0.001, decay: 0.28, sustain: 0, release: 0.05 },
      volume:      -4,
    }).connect(limiter);
    kickSnth.current = kick;

    // kick on every beat (4/4)
    const kickSeq = new Tone.Sequence(
      (time, v) => { if (v) kick.triggerAttackRelease("C1", "8n", time); },
      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], "16n"
    );
    kickRef.current = kickSeq;

    // ── snare: beats 2 & 4 ────────────────────────────────────────────────────
    const snare = new Tone.NoiseSynth({
      noise:    { type: "white" },
      envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 },
      volume:   -10,
    }).connect(limiter);
    snareSnth.current = snare;

    const snareSeq = new Tone.Sequence(
      (time, v) => { if (v) snare.triggerAttackRelease("16n", time); },
      [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], "16n"
    );
    snareRef.current = snareSeq;

    // ── hi-hats: 16th notes, accented on 8ths ─────────────────────────────────
    const hat = new Tone.MetalSynth({
      frequency:      400,
      envelope:       { attack: 0.001, decay: 0.06, release: 0.01 },
      harmonicity:    5.1,
      modulationIndex: 32,
      resonance:      4000,
      octaves:        1.5,
      volume:         -22,
    }).connect(limiter);
    hatSnth.current = hat;

    const hatSeq = new Tone.Sequence(
      (time, v) => { if (v) hat.triggerAttackRelease("16n", time); },
      [1,0.4,1,0.4, 1,0.4,1,0.4, 1,0.4,1,0.4, 1,0.4,1,0.4], "16n"
    );
    hatRef.current = hatSeq;

    // ── start everything ──────────────────────────────────────────────────────
    arpSeq.start(0);
    bassSeq.start(0);
    padSeq.start(0);
    kickSeq.start(0);
    snareSeq.start(0);
    hatSeq.start(0);
    Tone.getTransport().start();
    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    Tone.getTransport().stop();
    [seqRef, bassRef, kickRef, hatRef, snareRef, padRef].forEach(r => { r.current?.stop(); r.current?.dispose(); r.current = null; });
    [synthRef, bassSnth, kickSnth, hatSnth, snareSnth, padSnth].forEach(r => { r.current?.dispose(); r.current = null; });
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
