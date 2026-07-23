import type { SfxSpec } from "./sfx";

type WindowWithWebkit = typeof window & {
  webkitAudioContext?: typeof AudioContext;
};

export function createAudioContext(): AudioContext | null {
  const Ctor =
    window.AudioContext ?? (window as WindowWithWebkit).webkitAudioContext;
  if (!Ctor) return null;
  return new Ctor();
}

export function createNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * 0.4);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function vary(value: number, amount: number | undefined): number {
  if (!amount) return value;
  return value * (1 + (Math.random() * 2 - 1) * amount);
}

function playEnvelopedOsc(
  ctx: AudioContext,
  master: GainNode,
  type: OscillatorType,
  startFreq: number,
  endFreq: number,
  attack: number,
  release: number,
  peakGain: number,
): void {
  const now = ctx.currentTime;
  const end = now + attack + release;

  const envelope = ctx.createGain();
  envelope.connect(master);
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.linearRampToValueAtTime(peakGain, now + attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, end);

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, now);
  if (endFreq !== startFreq) {
    osc.frequency.exponentialRampToValueAtTime(endFreq, end);
  }
  osc.connect(envelope);
  osc.start(now);
  osc.stop(end + 0.05);
}

export function playSpec(
  ctx: AudioContext,
  master: GainNode,
  noise: AudioBuffer,
  spec: SfxSpec,
): void {
  if (spec.kind === "tone") {
    const startFreq = vary(spec.freq, spec.pitchVariation);
    const endFreq =
      spec.freqEnd === undefined
        ? startFreq
        : vary(spec.freqEnd, spec.pitchVariation);

    playEnvelopedOsc(
      ctx,
      master,
      spec.type,
      startFreq,
      endFreq,
      spec.attack,
      spec.decay,
      spec.gain,
    );

    if (spec.harmonic) {
      playEnvelopedOsc(
        ctx,
        master,
        spec.type,
        startFreq * spec.harmonic.ratio,
        endFreq * spec.harmonic.ratio,
        spec.attack,
        spec.decay,
        spec.harmonic.gain,
      );
    }
    return;
  }

  const now = ctx.currentTime;
  const end = now + spec.duration;

  const source = ctx.createBufferSource();
  source.buffer = noise;

  const filter = ctx.createBiquadFilter();
  filter.type = spec.filter;
  filter.Q.value = spec.q;
  filter.frequency.setValueAtTime(vary(spec.freqStart, spec.pitchVariation), now);
  filter.frequency.exponentialRampToValueAtTime(
    vary(spec.freqEnd, spec.pitchVariation),
    end,
  );

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.linearRampToValueAtTime(spec.gain, now + spec.attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, end);

  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(master);
  source.start(now);
  source.stop(end + 0.05);
}
