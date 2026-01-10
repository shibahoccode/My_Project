import { useCallback, useRef, useEffect, useState } from 'react';

interface DrumSound {
  name: string;
  frequency?: number;
  type: 'kick' | 'snare' | 'hihat' | 'tom' | 'crash' | 'clap';
}

const drumSounds: Record<string, DrumSound> = {
  kick: { name: 'Kick', type: 'kick' },
  snare: { name: 'Snare', type: 'snare' },
  hihat: { name: 'Hi-Hat', type: 'hihat' },
  tom: { name: 'Tom', frequency: 200, type: 'tom' },
  crash: { name: 'Crash', type: 'crash' },
  ride: { name: 'Ride', type: 'hihat' },
  clap: { name: 'Clap', type: 'clap' },
  openHihat: { name: 'Open Hi-Hat', type: 'hihat' },
  floorTom: { name: 'Floor Tom', frequency: 80, type: 'tom' },
};

export const useAudioEngine = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume;
    }
    return audioContextRef.current;
  }, [volume]);

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  }, []);

  const playKick = useCallback((ctx: AudioContext, output: GainNode) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(output);
    
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  const playSnare = useCallback((ctx: AudioContext, output: GainNode) => {
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(output);
    
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 180;
    oscGain.gain.setValueAtTime(0.7, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(oscGain);
    oscGain.connect(output);
    
    noise.start(ctx.currentTime);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }, []);

  const playHihat = useCallback((ctx: AudioContext, output: GainNode, open = false) => {
    const bufferSize = ctx.sampleRate * (open ? 0.5 : 0.1);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (open ? 0.5 : 0.1));
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    
    noise.start(ctx.currentTime);
  }, []);

  const playTom = useCallback((ctx: AudioContext, output: GainNode, freq = 150) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(output);
    
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }, []);

  const playCrash = useCallback((ctx: AudioContext, output: GainNode) => {
    const bufferSize = ctx.sampleRate * 1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 5000;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    
    noise.start(ctx.currentTime);
  }, []);

  const playClap = useCallback((ctx: AudioContext, output: GainNode) => {
    for (let i = 0; i < 3; i++) {
      const bufferSize = ctx.sampleRate * 0.02;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2500;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.8, ctx.currentTime + i * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1 + i * 0.015);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(output);
      
      noise.start(ctx.currentTime + i * 0.015);
    }
  }, []);

  const playSound = useCallback((soundId: string) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const sound = drumSounds[soundId];
    if (!sound || !gainNodeRef.current) return;

    const output = gainNodeRef.current;

    switch (sound.type) {
      case 'kick':
        playKick(ctx, output);
        break;
      case 'snare':
        playSnare(ctx, output);
        break;
      case 'hihat':
        playHihat(ctx, output, soundId === 'openHihat');
        break;
      case 'tom':
        playTom(ctx, output, sound.frequency || 150);
        break;
      case 'crash':
        playCrash(ctx, output);
        break;
      case 'clap':
        playClap(ctx, output);
        break;
    }
  }, [getAudioContext, playKick, playSnare, playHihat, playTom, playCrash, playClap]);

  return { playSound, volume, updateVolume };
};
