import React, { useState, useEffect } from 'react';
import { Activity, Play, Square, Upload, RefreshCw, Layers, CheckCircle2, FileMusic } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function Training({ status, dataset, onStartTraining, onStopTraining, onUploadMidi, onRefreshDataset }) {
  const [epochs, setEpochs] = useState(20);
  const [learningRate, setLearningRate] = useState(0.003);
  const [batchSize, setBatchSize] = useState(16);
  const [hiddenDim, setHiddenDim] = useState(256);
  const [lossData, setLossData] = useState([
    { epoch: 1, loss: 4.1 },
    { epoch: 2, loss: 3.65 },
    { epoch: 3, loss: 2.95 },
    { epoch: 4, loss: 2.55 },
    { epoch: 5, loss: 2.46 }
  ]);
  const [uploading, setUploading] = useState(false);

  // Listen to WebSocket training updates
  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${wsProtocol}//127.0.0.1:8000/ws/train`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'progress') {
          setLossData(prev => {
            const exists = prev.find(p => p.epoch === data.epoch);
            if (exists) return prev;
            return [...prev, { epoch: data.epoch, loss: data.loss }];
          });
        }
      } catch (e) {
        console.error("WS Parse error", e);
      }
    };

    return () => ws.close();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    await onUploadMidi(file);
    setUploading(false);
    onRefreshDataset();
  };

  const chartData = {
    labels: lossData.map(d => `Epoch ${d.epoch}`),
    datasets: [
      {
        label: 'CrossEntropy Loss (Pitch + Duration)',
        data: lossData.map(d => d.loss),
        borderColor: '#00F2FE',
        backgroundColor: 'rgba(0, 242, 254, 0.15)',
        borderWidth: 3,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#4FACFE',
        pointRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9CA3AF', font: { family: 'Outfit', size: 12 } }
      }
    },
    scales: {
      x: {
        ticks: { color: '#6B7280' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: '#6B7280' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Training Loss Curve & Status */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Real-Time Model Loss Curve</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              Latest Loss: {status?.last_loss ? status.last_loss.toFixed(4) : (lossData[lossData.length - 1]?.loss || 'N/A')}
            </span>
          </div>

          <div className="h-64 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Hyperparameters Form */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Training Configuration
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Epochs</label>
              <input
                type="number"
                min="5"
                max="100"
                value={epochs}
                onChange={(e) => setEpochs(parseInt(e.target.value) || 20)}
                className="w-full bg-gray-900 border border-white/10 rounded-lg p-2 text-xs font-mono text-cyan-400 font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Learning Rate</label>
              <input
                type="number"
                step="0.001"
                min="0.0001"
                max="0.01"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.003)}
                className="w-full bg-gray-900 border border-white/10 rounded-lg p-2 text-xs font-mono text-cyan-400 font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Batch Size</label>
              <input
                type="number"
                min="4"
                max="64"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value) || 16)}
                className="w-full bg-gray-900 border border-white/10 rounded-lg p-2 text-xs font-mono text-cyan-400 font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">LSTM Hidden Dim</label>
              <select
                value={hiddenDim}
                onChange={(e) => setHiddenDim(parseInt(e.target.value))}
                className="w-full bg-gray-900 border border-white/10 rounded-lg p-2 text-xs text-gray-200 outline-none"
              >
                <option value={128}>128 Units</option>
                <option value={256}>256 Units</option>
                <option value={512}>512 Units</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            {status?.is_training ? (
              <button
                onClick={onStopTraining}
                className="btn-secondary w-full justify-center !border-rose-500/40 !text-rose-400 hover:!bg-rose-500/20"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Training</span>
              </button>
            ) : (
              <button
                onClick={() => onStartTraining({ epochs, batch_size: batchSize, lr: learningRate, hidden_dim: hiddenDim })}
                className="btn-primary w-full justify-center"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Training PyTorch Model</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dataset Inspector & Custom MIDI Upload */}
      <div className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <FileMusic className="w-4 h-4 text-cyan-400" /> MIDI Training Dataset
            </h3>
            <button onClick={onRefreshDataset} className="text-gray-400 hover:text-cyan-400" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-gray-400 mb-3">
            Total Dataset Tracks: <span className="text-white font-bold">{dataset?.file_count || 0}</span>
          </div>

          {/* Dataset list */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {dataset?.files?.map((f, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <span className="font-mono text-gray-200 truncate max-w-[160px]">{f.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold">
                  {f.note_count} notes
                </span>
              </div>
            ))}
          </div>

          {/* Upload Form */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <label className="block text-xs font-semibold text-gray-300 mb-2">Upload Custom MIDI File</label>
            <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-500/10 border border-dashed border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-bold cursor-pointer transition-all">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Select .mid File'}</span>
              <input type="file" accept=".mid,.midi" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
