import React from 'react';
import { Library as LibraryIcon, Play, Download, Music, RefreshCw, Sparkles } from 'lucide-react';

export function Library({ samples = [], onPlaySample, onRefreshSamples }) {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <LibraryIcon className="w-5 h-5 text-cyan-400" />
              <span>AI Generated Track Library</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Saved MIDI sequences ready for playback or DAW export</p>
          </div>

          <button onClick={onRefreshSamples} className="btn-secondary text-xs">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Tracks</span>
          </button>
        </div>

        {samples.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
            <Music className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-300">No generated MIDI files found yet.</p>
            <p className="text-xs text-gray-500 mt-1">Switch to the Studio tab to compose your first sequence with AI!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {samples.map((sample, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-gray-200">{sample.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(sample.created_at * 1000).toLocaleTimeString()} • MIDI Output
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`http://127.0.0.1:8000/api/download/${sample.name}`}
                    download
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-cyan-400 transition-colors"
                    title="Download .MID File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
