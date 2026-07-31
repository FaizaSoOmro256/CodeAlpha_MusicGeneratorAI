import React from 'react';
import { Music, Cpu, Sparkles, Activity, Layers, Library } from 'lucide-react';

export function Header({ activeTab, setActiveTab, status }) {
  return (
    <header className="glass-card mb-6 p-4 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Music className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="glow-text">AURA AI</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold uppercase tracking-wider">
              LSTM Neural Synth
            </span>
          </h1>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <span>Deep Learning Music Generation & Preprocessing Engine</span>
            <span className="text-gray-600">•</span>
            <span className="text-cyan-400 font-medium">Developed by Faiza Soomro</span>
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center bg-gray-900/60 p-1.5 rounded-xl border border-white/5 gap-1">
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'studio'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('pianoroll')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'pianoroll'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Piano Roll & Synth</span>
        </button>

        <button
          onClick={() => setActiveTab('training')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'training'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Model Training</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'library'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Library className="w-4 h-4" />
          <span>Library</span>
        </button>
      </nav>

      {/* System Status Indicators */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>{status?.device?.toUpperCase() || 'CPU'}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <span className={`w-2 h-2 rounded-full ${status?.is_training ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="text-gray-300">
            {status?.is_training ? 'Training Model...' : 'Model Ready'}
          </span>
        </div>
      </div>
    </header>
  );
}
