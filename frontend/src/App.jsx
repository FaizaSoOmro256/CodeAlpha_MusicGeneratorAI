import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Studio } from './components/Studio';
import { PianoRoll } from './components/PianoRoll';
import { Training } from './components/Training';
import { Library } from './components/Library';

const API_BASE = "http://127.0.0.1:8000/api";

export function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [status, setStatus] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [samples, setSamples] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [currentNotes, setCurrentNotes] = useState([]);
  const [currentBpm, setCurrentBpm] = useState(120);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error("API Status Error", e);
    }
  };

  const fetchDataset = async () => {
    try {
      const res = await fetch(`${API_BASE}/dataset`);
      const data = await res.json();
      setDataset(data);
    } catch (e) {
      console.error("API Dataset Error", e);
    }
  };

  const fetchSamples = async () => {
    try {
      const res = await fetch(`${API_BASE}/samples`);
      const data = await res.json();
      setSamples(data.samples || []);
    } catch (e) {
      console.error("API Samples Error", e);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchDataset();
    fetchSamples();

    const interval = setInterval(() => {
      fetchStatus();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async (params) => {
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      setIsGenerating(false);

      if (data && data.notes) {
        setLastResult(data);
        setCurrentNotes(data.notes);
        setCurrentBpm(data.bpm || 120);
        fetchSamples();
        return data;
      }
    } catch (e) {
      console.error("Generate error", e);
      setIsGenerating(false);
    }
  };

  const handlePlaySequence = (notes, bpm) => {
    setCurrentNotes(notes);
    setCurrentBpm(bpm || 120);
    setActiveTab('pianoroll');
  };

  const handleStartTraining = async (params) => {
    try {
      await fetch(`${API_BASE}/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      fetchStatus();
    } catch (e) {
      console.error("Start training error", e);
    }
  };

  const handleStopTraining = async () => {
    try {
      await fetch(`${API_BASE}/train/stop`, { method: 'POST' });
      fetchStatus();
    } catch (e) {
      console.error("Stop training error", e);
    }
  };

  const handleUploadMidi = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });
      fetchDataset();
    } catch (e) {
      console.error("Upload error", e);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} status={status} />

      <main className="transition-all duration-300">
        {activeTab === 'studio' && (
          <Studio
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            lastResult={lastResult}
            onPlaySequence={handlePlaySequence}
          />
        )}

        {activeTab === 'pianoroll' && (
          <PianoRoll currentNotes={currentNotes} bpm={currentBpm} />
        )}

        {activeTab === 'training' && (
          <Training
            status={status}
            dataset={dataset}
            onStartTraining={handleStartTraining}
            onStopTraining={handleStopTraining}
            onUploadMidi={handleUploadMidi}
            onRefreshDataset={fetchDataset}
          />
        )}

        {activeTab === 'library' && (
          <Library
            samples={samples}
            onPlaySample={handlePlaySequence}
            onRefreshSamples={fetchSamples}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-500 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>AURA AI Music Generator • PyTorch LSTM & music21 Engine</span>
        <span className="text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          Developed by Faiza Soomro
        </span>
      </footer>
    </div>
  );
}

export default App;
