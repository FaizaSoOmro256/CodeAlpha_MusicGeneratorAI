import React, { useState } from 'react';
import { Sparkles, Sliders, Wand2, Music, Check, Disc, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Studio({ onGenerate, isGenerating, lastResult, onPlaySequence }) {
  const [numNotes, setNumNotes] = useState(64);
  const [temperature, setTemperature] = useState(0.85);
  const [bpm, setBpm] = useState(120);
  const [scaleName, setScaleName] = useState('Chromatic');

  const presets = [
    { name: "Classical Sonata", notes: 64, temp: 0.6, scale: "Major", bpm: 110 },
    { name: "Jazz Improvisation", notes: 64, temp: 0.95, scale: "Blues", bpm: 125 },
    { name: "Ambient Pentatonic", notes: 96, temp: 0.75, scale: "Pentatonic", bpm: 90 },
    { name: "Experimental Synth", notes: 128, temp: 1.2, scale: "Minor", bpm: 140 }
  ];

  const applyPreset = (preset) => {
    setNumNotes(preset.notes);
    setTemperature(preset.temp);
    setScaleName(preset.scale);
    setBpm(preset.bpm);
  };

  const handleGenerateClick = async () => {
    const res = await onGenerate({
      num_notes: numNotes,
      temperature: temperature,
      bpm: bpm,
      scale_name: scaleName
    });

    if (res && res.notes) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Columns: Control Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Presets Bar */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-cyan-400" /> Style & Motif Presets
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p)}
                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-left transition-all group"
              >
                <div className="text-xs font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">
                  {p.name}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {p.scale} • {p.bpm} BPM
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Hyperparameter Sliders */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>Generation Parameters</span>
            </h3>
            <span className="text-xs text-gray-400">LSTM Temperature & Nucleus Sampling</span>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-300">Temperature (Melodic Creativity)</span>
              <span className="text-cyan-400 font-mono font-bold text-sm">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.6"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>0.2 (Structured / Strict)</span>
              <span>0.8 (Balanced)</span>
              <span>1.6 (Experimental)</span>
            </div>
          </div>

          {/* Note Length */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-300">Sequence Length (Notes/Chords)</span>
              <span className="text-cyan-400 font-mono font-bold text-sm">{numNotes}</span>
            </div>
            <input
              type="range"
              min="32"
              max="160"
              step="16"
              value={numNotes}
              onChange={(e) => setNumNotes(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>32 (Short Motif)</span>
              <span>64 (Standard Phrase)</span>
              <span>160 (Full Composition)</span>
            </div>
          </div>

          {/* BPM & Scale Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Tempo (BPM)</label>
              <input
                type="number"
                min="60"
                max="220"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value) || 120)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl p-2.5 text-sm text-cyan-400 font-mono font-bold outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Scale / Harmonic Constraint</label>
              <select
                value={scaleName}
                onChange={(e) => setScaleName(e.target.value)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl p-2.5 text-sm text-gray-200 outline-none focus:border-cyan-400"
              >
                <option value="Chromatic">Chromatic (Unconstrained)</option>
                <option value="Major">Natural Major Scale</option>
                <option value="Minor">Natural Minor Scale</option>
                <option value="Pentatonic">Major Pentatonic</option>
                <option value="Blues">Jazz Blues Scale</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="btn-primary w-full py-3.5 justify-center text-base rounded-xl"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>LSTM Model Composing Sequence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-current" />
                  <span>Generate AI Music Sequence</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Generation Status & Quick Preview */}
      <div className="space-y-6">
        <div className="glass-card p-6 flex flex-col justify-between min-h-[380px]">
          <div>
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Disc className="w-4 h-4 text-cyan-400" /> Active Output Track
            </h3>

            {lastResult && lastResult.notes ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-300 font-bold">{lastResult.filename}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold uppercase">
                      {lastResult.status === 'success' ? 'PyTorch Trained' : 'Baseline Pattern'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>Pitches / Notes: <span className="font-bold text-white">{lastResult.notes.length}</span></div>
                    <div>Tempo: <span className="font-bold text-white">{lastResult.bpm} BPM</span></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-900/60 border border-white/5 text-xs">
                  <div className="text-gray-400 font-semibold mb-2">Note Sequence Snippet:</div>
                  <div className="font-mono text-cyan-400/90 text-[11px] truncate">
                    {lastResult.notes.slice(0, 12).map(n => n[0]).join(" -> ")}...
                  </div>
                </div>

                <button
                  onClick={() => onPlaySequence(lastResult.notes, lastResult.bpm)}
                  className="btn-secondary w-full justify-center"
                >
                  <Play className="w-4 h-4 fill-current text-cyan-400" />
                  <span>Play in Synth Engine</span>
                </button>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-xl">
                <Music className="w-10 h-10 text-gray-600 mb-2" />
                <p className="text-xs text-gray-400">No generated track active yet.</p>
                <p className="text-[10px] text-gray-500 mt-1">Configure options and click "Generate AI Music Sequence"</p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-gray-500 pt-4 border-t border-white/5">
            Model: PyTorch Dual-Head LSTM (Pitch + Duration)
          </div>
        </div>
      </div>
    </div>
  );
}
