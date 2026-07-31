// WebAudio API Polyphonic Synthesizer engine with ADSR envelope & Reverb effect
class WebAudioSynth {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.reverbNode = null;
    this.activeOscillators = new Map();
    this.instrumentType = "piano"; // "piano", "synth", "pad"
    this.volume = 0.7;
    this.isMuted = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);

      // Create simple synthetic reverb impulse response
      const sampleRate = this.audioCtx.sampleRate;
      const length = sampleRate * 1.5;
      const impulse = this.audioCtx.createBuffer(2, length, sampleRate);
      for (let i = 0; i < 2; i++) {
        const channel = impulse.getChannelData(i);
        for (let j = 0; j < length; j++) {
          channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2);
        }
      }

      this.reverbNode = this.audioCtx.createConvolver();
      this.reverbNode.buffer = impulse;

      const reverbGain = this.audioCtx.createGain();
      reverbGain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);

      this.masterGain.connect(this.audioCtx.destination);
      this.masterGain.connect(this.reverbNode);
      this.reverbNode.connect(reverbGain);
      reverbGain.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(val) {
    this.volume = val;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
    }
  }

  setInstrument(type) {
    this.instrumentType = type;
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  playNote(midiNote, durationSec = 0.5, velocity = 0.8) {
    this.init();
    if (this.isMuted) return;

    const now = this.audioCtx.currentTime;
    const freq = this.midiToFreq(midiNote);

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    if (this.instrumentType === "piano") {
      // Triangle + Sine harmonic mix
      osc.type = "triangle";
      
      const subOsc = this.audioCtx.createOscillator();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(freq * 2, now);
      
      const subGain = this.audioCtx.createGain();
      subGain.gain.setValueAtTime(0.3 * velocity, now);
      subOsc.connect(subGain);
      subGain.connect(gain);
      subOsc.start(now);
      subOsc.stop(now + durationSec + 0.5);

      // ADSR Envelope for Piano
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.8 * velocity, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.2 * velocity, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec + 0.3);

    } else if (this.instrumentType === "synth") {
      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.6 * velocity, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec + 0.1);

    } else if (this.instrumentType === "pad") {
      osc.type = "sine";
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.5 * velocity, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec + 0.8);
    }

    osc.frequency.setValueAtTime(freq, now);
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + durationSec + 0.8);
  }

  playChord(midiArray, durationSec = 1.0) {
    midiArray.forEach(note => this.playNote(note, durationSec, 0.7));
  }
}

export const synth = new WebAudioSynth();
