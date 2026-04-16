import React, { useCallback, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import * as Tone from "tone";

// ─── BPM & time sig ──────────────────────────────────────────────────────────
const BPM = 120;

// ─── 8-bar melody in A minor (Am → F → C → G) ──────────────────────────────
// [time, note, duration]
type NoteEvent = [string, string, string];

const MELODY: NoteEvent[] = [
  // Bar 0-1: Am
  ["0:0:0","E5","4n"], ["0:1:0","D5","4n"], ["0:2:0","C5","4n"], ["0:3:0","B4","8n"], ["0:3:2","A4","8n"],
  ["1:0:0","A4","2n"],                       ["1:2:0","C5","8n"], ["1:2:2","E5","8n"], ["1:3:0","A5","4n"],
  // Bar 2-3: F
  ["2:0:0","F5","4n"], ["2:1:0","E5","4n"], ["2:2:0","D5","8n"], ["2:2:2","C5","8n"], ["2:3:0","D5","4n"],
  ["3:0:0","C5","4n"], ["3:1:0","Bb4","4n"],["3:2:0","A4","2n"],
  // Bar 4-5: C
  ["4:0:0","E5","4n"], ["4:1:0","G5","4n"], ["4:2:0","E5","8n"], ["4:2:2","D5","8n"], ["4:3:0","C5","4n"],
  ["5:0:0","D5","8n"], ["5:0:2","E5","8n"], ["5:1:0","D5","4n"], ["5:2:0","C5","8n"], ["5:2:2","B4","8n"], ["5:3:0","A4","4n"],
  // Bar 6-7: G
  ["6:0:0","D5","4n"], ["6:1:0","B4","4n"], ["6:2:0","G4","4n"], ["6:3:0","A4","8n"], ["6:3:2","B4","8n"],
  ["7:0:0","G5","2n"],                       ["7:2:0","F#5","4n"],["7:3:0","E5","4n"],
];

// ─── Walking bass line ────────────────────────────────────────────────────────
const BASS: NoteEvent[] = [
  // Am
  ["0:0:0","A2","4n"],["0:1:0","E2","4n"],["0:2:0","A2","4n"],["0:3:0","G2","4n"],
  ["1:0:0","A2","4n"],["1:1:0","C3","4n"],["1:2:0","E3","4n"],["1:3:0","G2","4n"],
  // F
  ["2:0:0","F2","4n"],["2:1:0","C3","4n"],["2:2:0","F2","4n"],["2:3:0","E2","4n"],
  ["3:0:0","F2","4n"],["3:1:0","A2","4n"],["3:2:0","C3","8n"],["3:2:2","Bb2","8n"],["3:3:0","A2","4n"],
  // C
  ["4:0:0","C3","4n"],["4:1:0","G2","4n"],["4:2:0","C3","4n"],["4:3:0","B2","4n"],
  ["5:0:0","C3","4n"],["5:1:0","E3","4n"],["5:2:0","G3","4n"],["5:3:0","F3","4n"],
  // G
  ["6:0:0","G2","4n"],["6:1:0","D3","4n"],["6:2:0","G2","4n"],["6:3:0","F#2","4n"],
  ["7:0:0","G2","4n"],["7:1:0","B2","4n"],["7:2:0","D3","4n"],["7:3:0","E3","4n"],
];

// ─── Pad chords (one per bar) ─────────────────────────────────────────────────
const PADS: NoteEvent[] = [
  ["0:0:0",["A3","C4","E4","G4"] as any,"1m"],
  ["1:0:0",["A3","C4","E4","G4"] as any,"1m"],
  ["2:0:0",["F3","A3","C4","E4"] as any,"1m"],
  ["3:0:0",["F3","A3","C4","E4"] as any,"1m"],
  ["4:0:0",["C3","E3","G3","B3"] as any,"1m"],
  ["5:0:0",["C3","E3","G3","B3"] as any,"1m"],
  ["6:0:0",["G2","B2","D3","F#3"] as any,"1m"],
  ["7:0:0",["G2","B2","D3","F#3"] as any,"1m"],
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
  const seqRef   = useRef<Tone.Part | null>(null);
  const bassRef  = useRef<Tone.Part | null>(null);
  const kickRef  = useRef<Tone.Sequence | null>(null);
  const hatRef   = useRef<Tone.Sequence | null>(null);
  const snareRef = useRef<Tone.Sequence | null>(null);
  const padRef   = useRef<Tone.Part | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const bassSnth = useRef<Tone.Synth | null>(null);
  const kickSnth = useRef<Tone.MembraneSynth | null>(null);
  const hatSnth  = useRef<Tone.MetalSynth | null>(null);
  const snareSnth= useRef<Tone.NoiseSynth | null>(null);
  const padSnth  = useRef<Tone.PolySynth | null>(null);

  const start = useCallback(async () => {
    await Tone.start();
    Tone.getTransport().bpm.value = BPM;
    Tone.getTransport().loop     = true;
    Tone.getTransport().loopEnd  = "8m";

    // ── master chain ─────────────────────────────────────────────────────────
    const comp    = new Tone.Compressor({ threshold: -20, ratio: 4, attack: 0.005, release: 0.15 }).toDestination();
    const limiter = new Tone.Limiter(-2).connect(comp);

    // ── lead synth — detuned saw, dotted-8th delay (very 80s) ────────────────
    const delay  = new Tone.FeedbackDelay({ delayTime: "8n.", feedback: 0.35, wet: 0.35 }).connect(limiter);
    const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).connect(limiter);
    const leadFilter = new Tone.Filter({ frequency: 3500, type: "lowpass", rolloff: -12 }).connect(delay).connect(reverb);
    const lead = new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope:   { attack: 0.04, decay: 0.2, sustain: 0.6, release: 1.2 },
      volume: -10,
    }).connect(leadFilter);
    synthRef.current = lead;

    const melodyPart = new Tone.Part<NoteEvent>((time, [, note, dur]) => {
      lead.triggerAttackRelease(note, dur, time);
    }, MELODY);
    melodyPart.loop    = true;
    melodyPart.loopEnd = "8m";
    seqRef.current = melodyPart;

    // ── bass — punchy square with portamento ──────────────────────────────────
    const bassFilter = new Tone.Filter({ frequency: 700, type: "lowpass" }).connect(limiter);
    const bass = new Tone.Synth({
      oscillator: { type: "square" },
      envelope:   { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.4 },
      portamento: 0.04,
      volume: -7,
    }).connect(bassFilter);
    bassSnth.current = bass;

    const bassPart = new Tone.Part<NoteEvent>((time, [, note, dur]) => {
      bass.triggerAttackRelease(note, dur, time);
    }, BASS);
    bassPart.loop    = true;
    bassPart.loopEnd = "8m";
    bassRef.current = bassPart;

    // ── lush string pad ───────────────────────────────────────────────────────
    const padReverb = new Tone.Reverb({ decay: 5, wet: 0.7 }).connect(limiter);
    const chorus    = new Tone.Chorus(2, 3.5, 0.6).connect(padReverb).start();
    const pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope:   { attack: 0.6, decay: 0.4, sustain: 0.9, release: 3 },
      volume: -22,
    }).connect(chorus);
    padSnth.current = pad;

    const padPart = new Tone.Part<NoteEvent>((time, [, notes, dur]) => {
      pad.triggerAttackRelease(notes as unknown as string[], dur, time);
    }, PADS);
    padPart.loop    = true;
    padPart.loopEnd = "8m";
    padRef.current = padPart;

    // ── 808 kick ──────────────────────────────────────────────────────────────
    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 10,
      envelope: { attack: 0.001, decay: 0.32, sustain: 0, release: 0.1 },
      volume: -4,
    }).connect(limiter);
    kickSnth.current = kick;

    const kickSeq = new Tone.Sequence(
      (time, v) => { if (v) kick.triggerAttackRelease("C1", "8n", time); },
      [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], "16n"
    );
    kickRef.current = kickSeq;

    // ── snare / clap on 2 & 4 ────────────────────────────────────────────────
    const snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.14, sustain: 0, release: 0.04 },
      volume: -12,
    }).connect(limiter);
    snareSnth.current = snare;

    const snareSeq = new Tone.Sequence(
      (time, v) => { if (v) snare.triggerAttackRelease("16n", time); },
      [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], "16n"
    );
    snareRef.current = snareSeq;

    // ── hi-hat: closed 8ths, open on the "and" of 2 & 4 ─────────────────────
    const hat = new Tone.MetalSynth({
      frequency: 400, harmonicity: 5.1, modulationIndex: 32,
      resonance: 4000, octaves: 1.5,
      envelope: { attack: 0.001, decay: 0.07, release: 0.01 },
      volume: -22,
    }).connect(limiter);
    hatSnth.current = hat;

    const hatSeq = new Tone.Sequence(
      (time, v) => { if (v) hat.triggerAttackRelease("16n", time); },
      [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], "16n"
    );
    hatRef.current = hatSeq;

    // ── start all ─────────────────────────────────────────────────────────────
    melodyPart.start(0);
    bassPart.start(0);
    padPart.start(0);
    kickSeq.start(0);
    snareSeq.start(0);
    hatSeq.start(0);
    Tone.getTransport().start();
    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    Tone.getTransport().stop();
    Tone.getTransport().loop = false;
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
