<<<<<<< HEAD
# 🎵 AURA AI - Neural Music Generator Studio

> **Developed by Faiza Soomro**

An end-to-end AI Music Generation application powered by a **PyTorch Dual-Head LSTM Neural Network**, **`music21` MIDI preprocessing**, a **FastAPI** REST & WebSocket backend, and a **modern glassmorphic React web studio** with an interactive **WebAudio polyphonic synthesizer** and **waterfall piano roll visualizer**.

---

## 🌟 Key Features

- **🎹 `music21` MIDI Preprocessing Pipeline**: Automatically parses MIDI files into pitch sequences (notes and chords), quarter note durations, rests, and velocity. Tokenizes data for deep learning training.
- **🧠 PyTorch Dual-Head LSTM Architecture**: Predicts both note pitch distributions and note duration distributions simultaneously. Supports temperature sampling, nucleus sampling, and harmonic scale constraints (Major, Minor, Pentatonic, Blues, Chromatic).
- **🎨 Glassmorphic Interactive Web Studio**:
  - **Synthesia-Style Waterfall Piano Roll**: Dynamic canvas visualizing note streams in real-time.
  - **Polyphonic WebAudio Synthesizer**: Built-in soundfont engine (Grand Piano, Synth Lead, Ambient Pad) with ADSR envelope & reverb for instant browser playback.
  - **Generation Parameters**: Control temperature (creativity), sequence length, tempo (BPM), and key signature constraints. Includes quick style presets (Classical Sonata, Jazz Improvisation, Ambient, Experimental).
- **📈 Real-Time AI Training Dashboard**: Live Chart.js loss curve monitoring via WebSockets, configurable hyper-parameters (epochs, learning rate, batch size, LSTM units), and custom MIDI file uploader.
- **📁 Track Library & MIDI Export**: One-click download for generated `.mid` files for DAW integration (Ableton, FL Studio, Logic Pro).

---

## 🛠️ Tech Stack & Requirements

### Backend (Python)
- **Python 3.10+** (Python 3.12 recommended)
- **PyTorch 2.0+**: Deep learning model framework
- **`music21`**: MIDI parsing, note extraction, stream synthesis
- **`mido`**: Low-level MIDI file processing
- **FastAPI & Uvicorn**: High-performance REST API server
- **WebSockets**: Real-time training progress streaming
- **SciPy & NumPy**: Numerical array processing

### Frontend (JavaScript / React)
- **Node.js 18+ & npm**
- **React 18 & Vite**: Frontend framework and build tool
- **Tailwind CSS & Glassmorphism**: Visual aesthetic system
- **Chart.js & react-chartjs-2**: Real-time training loss graphs
- **Lucide React**: Modern icons
- **WebAudio API**: Browser synthesizer engine

---

## 🚀 Quick Start Guide

### 1. Backend Setup

1. Open a terminal in the project directory:
   ```bash
   cd MusicGeneratorAI
   ```

2. Install Python dependencies:
   ```bash
   python -m pip install -r backend/requirements.txt
   ```

3. (Optional) Generate the sample dataset and train the baseline model:
   ```bash
   python -c "from backend.dataset_generator import create_sample_midi_dataset; create_sample_midi_dataset(); from backend.trainer import ModelTrainer; trainer = ModelTrainer(); trainer.train(epochs=5)"
   ```

4. Start the FastAPI backend server:
   ```bash
   python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
   ```
   The backend API will be available at `http://127.0.0.1:8000/api/status`.

---

### 2. Frontend Setup

1. Open a new terminal in the `frontend` directory:
   ```bash
   cd MusicGeneratorAI/frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev -- --port 3000
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📂 Project Structure

```
MusicGeneratorAI/
├── backend/
│   ├── data/
│   │   ├── midi/               # Curated & uploaded MIDI dataset files
│   │   └── samples/            # Generated AI MIDI files
│   ├── dataset_generator.py     # Prepares classical/jazz benchmark MIDI dataset
│   ├── preprocessing.py        # music21 MIDI parsing & sequence tokenization
│   ├── model.py                # PyTorch MusicLSTM neural network architecture
│   ├── trainer.py              # PyTorch training loop & WebSocket updates
│   ├── generator.py            # AI music generator with temperature sampling
│   ├── main.py                 # FastAPI application server & REST endpoints
│   ├── model_weights.pth       # Trained PyTorch model checkpoint
│   ├── vocab.json              # Pitch and duration vocabulary mappings
│   └── requirements.txt        # Python package requirements
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx      # Navigation bar & system status indicators
│   │   │   ├── Studio.jsx      # AI generation controls & parameter sliders
│   │   │   ├── PianoRoll.jsx   # Waterfall note visualizer & WebAudio player
│   │   │   ├── Training.jsx    # Real-time loss chart & dataset uploader
│   │   │   └── Library.jsx     # Saved track library & MIDI download panel
│   │   ├── utils/
│   │   │   └── synth.js        # WebAudio API Polyphonic Synthesizer
│   │   ├── App.jsx             # Main App component & API state manager
│   │   ├── index.css           # Glassmorphism design system & neon styles
│   │   └── main.jsx
│   ├── index.html              # Entry HTML with meta description & Tailwind
│   ├── package.json            # Node.js dependencies
│   └── vite.config.js
└── README.md
```

---

## 🎯 How to Use

1. **Generate Music**: Navigate to the **Studio** tab, select a style preset or adjust the temperature slider, choose a scale constraint, and click **"Generate AI Music Sequence"**.
2. **Listen & Play**: Click **"Play in Synth Engine"** or switch to the **Piano Roll & Synth** tab to watch notes stream across the waterfall visualizer while playing with different instruments (Grand Piano, Synth Lead, Ambient Pad).
3. **Train Custom Model**: Go to the **Model Training** tab, upload your own `.mid` files to the dataset, set the desired number of epochs, and click **"Start Training PyTorch Model"** to watch the loss curve decrease in real-time!
4. **Export Tracks**: Go to the **Library** tab to download generated `.mid` files for your favorite music production software.
=======
# CodeAlpha_MusicGeneratorAI
An AI-powered music generation system that uses an LSTM neural network to learn patterns from MIDI files and generate original music compositions. Built with Python, TensorFlow/Keras, and music21 as part of the CodeAlpha AI Internship.
>>>>>>> dfdc8d25675ee72e95b5259bddfa5bb2e69bdbc0
