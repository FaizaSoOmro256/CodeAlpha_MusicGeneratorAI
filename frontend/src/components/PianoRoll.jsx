import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music2, Sliders, Radio } from 'lucide-react';
import { synth } from '../utils/synth';

const PIANO_KEYS = [
  { note: 'C4', midi: 60, isBlack: false },
  { note: 'C#4', midi: 61, isBlack: true },
  { note: 'D4', midi: 62, isBlack: false },
  { note: 'D#4', midi: 63, isBlack: true },
  { note: 'E4', midi: 64, isBlack: false },
  { note: 'F4', midi: 65, isBlack: false },
  { note: 'F#4', midi: 66, isBlack: true },
  { note: 'G4', midi: 67, isBlack: false },
  { note: 'G#4', midi: 68, isBlack: true },
  { note: 'A4', midi: 69, isBlack: false },
  { note: 'A#4', midi: 70, isBlack: true },
  { note: 'B4', midi: 71, isBlack: false },
  { note: 'C5', midi: 72, isBlack: false },
  { note: 'C#5', midi: 73, isBlack: true },
  { note: 'D5', midi: 74, isBlack: false },
  { note: 'D#5', midi: 75, isBlack: true },
  { note: 'E5', midi: 76, isBlack: false },
  { note: 'F5', midi: 77, isBlack: false },
  { note: 'F#5', midi: 78, isBlack: true },
  { note: 'G5', midi: 79, isBlack: false },
  { note: 'G#5', midi: 80, isBlack: true },
  { note: 'A5', midi: 81, isBlack: false },
  { note: 'A#5', midi: 82, isBlack: true },
  { note: 'B5', midi: 83, isBlack: false },
  { note: 'C6', midi: 84, isBlack: false }
];

export function PianoRoll({ currentNotes = [], bpm = 120 }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMidiNotes, setActiveMidiNotes] = useState(new Set());
  const [instrument, setInstrument] = useState('piano');
  const [volume, setVolume] = useState(0.8);
  const [playbackSpeed, setPlaybackSpeed] = useState(bpm);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    synth.setInstrument(instrument);
  }, [instrument]);

  useEffect(() => {
    synth.setVolume(volume);
  }, [volume]);

  // Render Piano Roll Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const keyWidth = width / PIANO_KEYS.length;

    PIANO_KEYS.forEach((key, idx) => {
      ctx.beginPath();
      ctx.moveTo(idx * keyWidth, 0);
      ctx.lineTo(idx * keyWidth, height);
      ctx.stroke();
    });

    if (!currentNotes || currentNotes.length === 0) return;

    // Draw Notes
    const rowHeight = 12;
    currentNotes.forEach((item, idx) => {
      const [pitchStr, durVal] = item;
      const y = height - (idx + 1) * rowHeight;
      if (y < -50 || y > height + 50) return;

      const isCurrent = idx === currentIndex && isPlaying;
      
      let midis = [];
      if (pitchStr !== 'Rest') {
        if (pitchStr.includes('.')) {
          midis = pitchStr.split('.').map(n => parseInt(n));
        } else {
          midis = [parseInt(pitchStr)];
        }
      }

      midis.forEach(midi => {
        const keyIdx = PIANO_KEYS.findIndex(k => k.midi === midi);
        if (keyIdx !== -1) {
          const x = keyIdx * keyWidth;
          const noteWidth = keyWidth - 2;
          const noteHeight = Math.max(8, durVal * rowHeight * 1.5);

          // Glow for currently playing note
          if (isCurrent) {
            ctx.shadowColor = '#00F2FE';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#00F2FE';
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = PIANO_KEYS[keyIdx].isBlack ? '#8A2387' : '#4FACFE';
          }

          ctx.beginPath();
          ctx.roundRect(x + 1, y, noteWidth, noteHeight, 4);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    });
  }, [currentNotes, currentIndex, isPlaying]);

  // Handle Playback Loop
  useEffect(() => {
    let timer = null;
    if (isPlaying && currentNotes.length > 0) {
      const stepDurationMs = (60 / playbackSpeed) * 1000 * 0.5;

      const playStep = () => {
        if (currentIndex >= currentNotes.length) {
          setIsPlaying(false);
          setCurrentIndex(0);
          setActiveMidiNotes(new Set());
          return;
        }

        const [pitchStr, durVal] = currentNotes[currentIndex];
        const newActive = new Set();

        if (pitchStr !== 'Rest') {
          if (pitchStr.includes('.')) {
            const arr = pitchStr.split('.').map(n => parseInt(n));
            synth.playChord(arr, durVal * (60 / playbackSpeed));
            arr.forEach(m => newActive.add(m));
          } else {
            const m = parseInt(pitchStr);
            if (!isNaN(m)) {
              synth.playNote(m, durVal * (60 / playbackSpeed), 0.8);
              newActive.add(m);
            }
          }
        }

        setActiveMidiNotes(newActive);
        setCurrentIndex(prev => prev + 1);
      };

      timer = setTimeout(playStep, stepDurationMs);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, currentNotes, playbackSpeed]);

  const handleKeyClick = (midi) => {
    synth.playNote(midi, 0.6, 0.9);
    setActiveMidiNotes(new Set([midi]));
    setTimeout(() => setActiveMidiNotes(new Set()), 400);
  };

  const togglePlay = () => {
    if (currentNotes.length === 0) return;
    synth.init();
    setIsPlaying(!isPlaying);
  };

  const resetPlay = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setActiveMidiNotes(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Visualizer Header Controls */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            disabled={!currentNotes || currentNotes.length === 0}
            className="btn-primary"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Sequence'}</span>
          </button>

          <button onClick={resetPlay} className="btn-secondary" title="Reset sequence position">
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="text-xs text-gray-400 font-medium">
            Step: <span className="text-cyan-400 font-bold">{currentIndex}</span> / {currentNotes.length} notes
          </div>
        </div>

        {/* Controls: Instrument & Volume & BPM */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <select
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="bg-gray-900 border border-white/10 text-xs rounded-lg p-2 text-gray-200 outline-none focus:border-cyan-400"
            >
              <option value="piano">Grand Piano</option>
              <option value="synth">Synth Lead</option>
              <option value="pad">Warm Ambient Pad</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs w-32">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400">Tempo:</span>
            <input
              type="number"
              min="60"
              max="240"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseInt(e.target.value) || 120)}
              className="w-16 bg-gray-900 border border-white/10 text-xs rounded-lg p-1.5 text-cyan-400 text-center font-bold outline-none"
            />
            <span className="text-gray-500">BPM</span>
          </div>
        </div>
      </div>

      {/* Waterfall Piano Roll Canvas */}
      <div className="glass-card p-4 overflow-hidden relative">
        <div className="text-xs text-gray-400 font-semibold mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Music2 className="w-4 h-4 text-cyan-400" /> Note Sequence Visualizer (Synthesia Canvas)
          </span>
          <span className="text-xs text-cyan-400/80">Frequency / MIDI Range C4 - C6</span>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={260}
          className="w-full h-64 bg-gray-950/80 rounded-xl border border-white/5 shadow-inner"
        />

        {/* Interactive Piano Keyboard */}
        <div className="mt-4 flex justify-center relative select-none">
          <div className="flex bg-gray-950 p-2 rounded-xl border border-white/10 shadow-2xl relative">
            {PIANO_KEYS.map((key) => {
              const isActive = activeMidiNotes.has(key.midi);
              return (
                <button
                  key={key.midi}
                  onClick={() => handleKeyClick(key.midi)}
                  className={`relative flex flex-col justify-end items-center transition-all ${
                    key.isBlack
                      ? 'w-6 h-20 -mx-3 z-10 bg-slate-900 border border-slate-700 rounded-b-md shadow-lg hover:bg-slate-800'
                      : 'w-10 h-32 bg-slate-100 border border-slate-300 rounded-b-lg hover:bg-white text-slate-800'
                  } ${isActive ? 'ring-4 ring-cyan-400 !bg-cyan-400 !text-slate-950 shadow-cyan-400/50' : ''}`}
                >
                  <span className={`text-[9px] font-bold mb-1 ${key.isBlack ? 'text-gray-400' : 'text-gray-600'}`}>
                    {key.note}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
