import React, { useCallback, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import * as Tone from "tone";

// ═══════════════════════════════════════════════════════════════════════════════
//  "VOLTAGE" — D minor, 124 BPM
//  Structure: hook (Dm) → response (Bb) → build (C) → resolution (Dm)
// ═══════════════════════════════════════════════════════════════════════════════
const BPM = 124;

type NE  = [string, string,   string];   // [time, note, dur]
type CNE = [string, string[], string];   // [time, chord, dur]

// ── Lead melody ───────────────────────────────────────────────────────────────
const MELODY: NE[] = [
  // Bars 0-1: Hook — Dm (tense, driving)
  ["0:0:0","F5","4n"],  ["0:1:0","Ab5","4n"], ["0:2:0","Eb5","8n"], ["0:2:2","D5","8n"], ["0:3:0","C5","4n"],
  ["1:0:0","D5","2n"],                         ["1:2:0","C5","4n"],  ["1:3:0","Bb4","4n"],
  // Bars 2-3: Response — Bb (lifting, melodic)
  ["2:0:0","C5","8n"],  ["2:0:2","D5","8n"],  ["2:1:0","Eb5","4n"], ["2:2:0","F5","4n"],  ["2:3:0","G5","4n"],
  ["3:0:0","Ab5","4n"], ["3:1:0","G5","8n"],  ["3:1:2","F5","8n"],  ["3:2:0","Eb5","2n"],
  // Bars 4-5: Build — C (climbing, power)
  ["4:0:0","F5","4n"],  ["4:1:0","Ab5","4n"], ["4:2:0","Bb5","4n"], ["4:3:0","Ab5","8n"], ["4:3:2","G5","8n"],
  ["5:0:0","F5","4n"],  ["5:1:0","Eb5","4n"], ["5:2:0","D5","8n"],  ["5:2:2","C5","8n"],  ["5:3:0","Bb4","4n"],
  // Bars 6-7: Resolution — Dm (lands home, then launches again)
  ["6:0:0","C5","8n"],  ["6:0:2","D5","8n"],  ["6:1:0","F5","4n"],  ["6:2:0","Ab5","4n"], ["6:3:0","G5","8n"], ["6:3:2","F5","8n"],
  ["7:0:0","D5","2n"],                         ["7:2:0","D5","4n"],  ["7:3:0","F5","8n"],  ["7:3:2","Ab5","8n"],
];

// ── Walking bass ──────────────────────────────────────────────────────────────
const BASS: NE[] = [
  ["0:0:0","D2","4n"], ["0:1:0","F2","4n"],  ["0:2:0","D2","4n"],  ["0:3:0","C2","4n"],
  ["1:0:0","D2","4n"], ["1:1:0","A2","4n"],  ["1:2:0","G2","4n"],  ["1:3:0","F2","4n"],
  ["2:0:0","Bb1","4n"],["2:1:0","D2","4n"],  ["2:2:0","Bb1","4n"], ["2:3:0","C2","4n"],
  ["3:0:0","Bb1","4n"],["3:1:0","F2","4n"],  ["3:2:0","Eb2","4n"], ["3:3:0","F2","4n"],
  ["4:0:0","C2","4n"], ["4:1:0","G2","4n"],  ["4:2:0","C2","4n"],  ["4:3:0","Bb1","4n"],
  ["5:0:0","C2","4n"], ["5:1:0","E2","4n"],  ["5:2:0","G2","4n"],  ["5:3:0","F2","4n"],
  ["6:0:0","D2","4n"], ["6:1:0","F2","4n"],  ["6:2:0","A2","4n"],  ["6:3:0","C3","4n"],
  ["7:0:0","D2","4n"], ["7:1:0","A2","4n"],  ["7:2:0","F2","4n"],  ["7:3:0","E2","4n"],
];

// ── Pad chords ────────────────────────────────────────────────────────────────
const PADS: CNE[] = [
  ["0:0:0", ["D3","F3","A3","C4"], "1m"],
  ["1:0:0", ["D3","F3","A3","C4"], "1m"],
  ["2:0:0", ["Bb2","D3","F3","A3"],"1m"],
  ["3:0:0", ["Bb2","D3","F3","A3"],"1m"],
  ["4:0:0", ["C3","E3","G3","Bb3"],"1m"],
  ["5:0:0", ["C3","E3","G3","Bb3"],"1m"],
  ["6:0:0", ["D3","F3","A3","C4"], "1m"],
  ["7:0:0", ["D3","F3","A3","C4"], "1m"],
];

// ── Off-beat synth stabs (Moroder-style rhythmic pulse) ───────────────────────
const STABS: CNE[] = [
  ["0:1:2",["D4","F4","A4"],"16n"], ["0:3:2",["D4","F4","A4"],"16n"],
  ["2:1:2",["Bb3","D4","F4"],"16n"],["2:3:2",["Bb3","D4","F4"],"16n"],
  ["4:1:2",["C4","E4","G4"],"16n"], ["4:3:2",["C4","E4","G4"],"16n"],
  ["6:1:2",["D4","F4","A4"],"16n"], ["6:3:2",["D4","F4","A4"],"16n"],
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

// ─── component ────────────────────────────────────────────────────────────────
const SynthPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const parts  = useRef<(Tone.Part | Tone.Sequence)[]>([]);
  const nodes  = useRef<Tone.ToneAudioNode[]>([]);

  const start = useCallback(async () => {
    await Tone.start();
    Tone.getTransport().bpm.value = BPM;
    Tone.getTransport().loop    = true;
    Tone.getTransport().loopEnd = "8m";

    // ── Master ────────────────────────────────────────────────────────────────
    const comp    = new Tone.Compressor({ threshold: -18, ratio: 4, attack: 0.004, release: 0.12 }).toDestination();
    const limiter = new Tone.Limiter(-2).connect(comp);
    nodes.current.push(comp, limiter);

    // ── Lead — square wave + dotted-8th echo (Giorgio Moroder signature) ─────
    const echo   = new Tone.FeedbackDelay({ delayTime: "8n.", feedback: 0.38, wet: 0.32 }).connect(limiter);
    const reverb = new Tone.Reverb({ decay: 2, wet: 0.28 }).connect(limiter);
    const lpf    = new Tone.Filter({ frequency: 4000, type: "lowpass" }).connect(echo).connect(reverb);
    const lead   = new Tone.Synth({
      oscillator: { type: "square" },
      envelope:   { attack: 0.015, decay: 0.15, sustain: 0.65, release: 1.0 },
      volume: -9,
    }).connect(lpf);
    nodes.current.push(echo, reverb, lpf, lead);

    const melodyPart = new Tone.Part<NE>((time, [, n, d]) => lead.triggerAttackRelease(n, d, time), MELODY);
    melodyPart.loop = true; melodyPart.loopEnd = "8m";
    parts.current.push(melodyPart);

    // ── Bass — Moog-style sawtooth, portamento slide ──────────────────────────
    const bFilter = new Tone.Filter({ frequency: 600, type: "lowpass", rolloff: -24 }).connect(limiter);
    const bass    = new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope:   { attack: 0.008, decay: 0.18, sustain: 0.55, release: 0.45 },
      portamento: 0.05,
      volume: -7,
    }).connect(bFilter);
    nodes.current.push(bFilter, bass);

    const bassPart = new Tone.Part<NE>((time, [, n, d]) => bass.triggerAttackRelease(n, d, time), BASS);
    bassPart.loop = true; bassPart.loopEnd = "8m";
    parts.current.push(bassPart);

    // ── Lush pad — detuned saws, slow attack, heavy reverb ───────────────────
    const padVerb = new Tone.Reverb({ decay: 6, wet: 0.75 }).connect(limiter);
    const ch      = new Tone.Chorus(2, 3.5, 0.7).connect(padVerb).start();
    const pad     = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope:   { attack: 0.9, decay: 0.5, sustain: 0.85, release: 3.5 },
      volume: -24,
    }).connect(ch);
    nodes.current.push(padVerb, ch, pad);

    const padPart = new Tone.Part<CNE>((time, [, notes, d]) => pad.triggerAttackRelease(notes, d, time), PADS);
    padPart.loop = true; padPart.loopEnd = "8m";
    parts.current.push(padPart);

    // ── Stabs — sharp sawtooth chops for rhythmic drive ───────────────────────
    const stabF = new Tone.Filter({ frequency: 3500, type: "lowpass" }).connect(limiter);
    const stab  = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope:   { attack: 0.001, decay: 0.09, sustain: 0, release: 0.08 },
      volume: -18,
    }).connect(stabF);
    nodes.current.push(stabF, stab);

    const stabPart = new Tone.Part<CNE>((time, [, notes, d]) => stab.triggerAttackRelease(notes, d, time), STABS);
    stabPart.loop = true; stabPart.loopEnd = "8m";
    parts.current.push(stabPart);

    // ── 808 Kick ──────────────────────────────────────────────────────────────
    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 10,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.08 },
      volume: -4,
    }).connect(limiter);
    nodes.current.push(kick);

    const kickSeq = new Tone.Sequence(
      (t, v) => { if (v) kick.triggerAttackRelease("C1", "8n", t); },
      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], "16n"
    );
    parts.current.push(kickSeq);

    // ── Snare on 2 & 4 ────────────────────────────────────────────────────────
    const snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.13, sustain: 0, release: 0.04 },
      volume: -13,
    }).connect(limiter);
    nodes.current.push(snare);

    const snareSeq = new Tone.Sequence(
      (t, v) => { if (v) snare.triggerAttackRelease("16n", t); },
      [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], "16n"
    );
    parts.current.push(snareSeq);

    // ── Hi-hat: 8th notes, open accent on "and" of 2 & 4 ─────────────────────
    const hat = new Tone.MetalSynth({
      frequency: 400, harmonicity: 5.1, modulationIndex: 32,
      resonance: 4000, octaves: 1.5,
      envelope: { attack: 0.001, decay: 0.07, release: 0.01 },
      volume: -22,
    }).connect(limiter);
    nodes.current.push(hat);

    const hatSeq = new Tone.Sequence(
      (t, v) => { if (v) hat.triggerAttackRelease("16n", t); },
      [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], "16n"
    );
    parts.current.push(hatSeq);

    // ── Start all ─────────────────────────────────────────────────────────────
    parts.current.forEach(p => p.start(0));
    Tone.getTransport().start();
    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    Tone.getTransport().stop();
    Tone.getTransport().loop = false;
    parts.current.forEach(p => { p.stop(); p.dispose(); });
    nodes.current.forEach(n => n.dispose());
    parts.current = [];
    nodes.current = [];
    setPlaying(false);
  }, []);

  const toggle = () => (playing ? stop() : start());

  return (
    <Btn $active={playing} onClick={toggle} title={playing ? "Stop music" : "Play retro synth"}>
      <EQBar $active={playing} $delay={0} />
      <EQBar $active={playing} $delay={0.1} />
      <EQBar $active={playing} $delay={0.2} />
      <EQBar $active={playing} $delay={0.05} />
      {playing ? "VOLTAGE" : "▶ VOLTAGE"}
    </Btn>
  );
};

export default SynthPlayer;