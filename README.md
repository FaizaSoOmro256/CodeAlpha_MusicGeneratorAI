# 🎵 AURA AI: Neural Music Generator Studio

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-Deep%20Learning-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://code-alpha-music-generator-ai.vercel.app/)

An AI-powered music generation system that learns musical patterns from MIDI datasets using a PyTorch LSTM neural network and generates original MIDI compositions through an interactive web application.

---

# 📑 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-key-features)
- [Objectives](#-objectives)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [How to Use](#-how-to-use)
- [Model Architecture](#-model-architecture)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

# 📖 Overview

AURA AI is an end-to-end AI-powered music generation system that generates original MIDI compositions using deep learning. The project combines a PyTorch LSTM neural network, MIDI preprocessing with `music21`, a FastAPI backend, and a modern React frontend to provide an interactive platform for music generation, model training, visualization, and playback.

The system is designed to demonstrate how artificial intelligence can learn musical structures from MIDI datasets and generate new melodies by predicting note sequences and durations. In addition to music generation, the application provides tools for real-time model training, browser-based playback, piano roll visualization, and MIDI file export.

The project consists of two main components:

1. **Model Development (`backend/`)** – Handles MIDI preprocessing, dataset preparation, neural network training, inference, and API services.

2. **Web Application (`frontend/`)** – Provides an interactive interface for generating music, visualizing note sequences, adjusting generation parameters, training models, and exporting generated compositions.

---

# 🌐 Live Demo

### Frontend (UI Preview)

https://code-alpha-music-generator-ai.vercel.app/

> **Note**
>
> The deployed application demonstrates the frontend interface only. AI music generation requires the FastAPI backend, which must be run locally because free hosting platforms do not support the required PyTorch dependencies and trained model files.

---

# ✨ Key Features

## 🎼 AI Music Generation

- Generate original MIDI compositions using a PyTorch LSTM neural network.
- Learn musical patterns from MIDI datasets.
- Produce melodies using temperature and nucleus sampling.
- Support multiple musical scales and style presets.

---

## 🎹 MIDI Processing

- Parse MIDI files using `music21`.
- Extract notes, chords, durations, and rests.
- Convert musical sequences into training data.
- Support custom MIDI dataset uploads.

---

## 🧠 Deep Learning

- Dual-head LSTM neural network implemented with PyTorch.
- Simultaneous prediction of note pitches and durations.
- Configurable training parameters.
- Model checkpoint saving and loading.

---

## 🎨 Interactive Web Application

- Modern React-based interface.
- Interactive piano roll visualization.
- Built-in WebAudio synthesizer.
- Real-time music playback.
- Responsive user experience.

---

## 📊 Model Training

- Upload custom MIDI datasets.
- Train models directly from the web interface.
- Monitor training progress in real time using WebSockets.
- Configure epochs, batch size, learning rate, and hidden units.

---

## 📁 Export & Playback

- Download generated compositions as MIDI files.
- Compatible with FL Studio, Ableton Live, Logic Pro, Cubase, and other DAWs.
- Browser-based playback without additional software.

---

# 🎯 Objectives

- Demonstrate deep learning techniques for symbolic music generation.
- Learn musical structures from MIDI datasets using LSTM networks.
- Provide an interactive platform for AI-assisted music composition.
- Enable custom model training with user-provided datasets.
- Visualize and play generated music directly in the browser.
- Export AI-generated compositions for professional music production.

# 🛠️ Technology Stack

## Artificial Intelligence & Machine Learning

- Python
- PyTorch
- LSTM (Long Short-Term Memory)
- Deep Learning
- Sequence Modeling

---

## MIDI Processing

- music21
- mido
- NumPy
- SciPy

---

## Backend

- FastAPI
- Uvicorn
- WebSockets
- Pydantic

---

## Frontend

- React
- Vite
- Tailwind CSS
- Chart.js
- Lucide React
- WebAudio API

---

## Development Tools

- Git & GitHub
- npm
- Visual Studio Code

---

# 📂 Project Structure

```text
AURA-AI/
│
├── backend/
│   ├── data/
│   │   ├── midi/
│   │   └── samples/
│   ├── dataset_generator.py
│   ├── preprocessing.py
│   ├── model.py
│   ├── trainer.py
│   ├── generator.py
│   ├── main.py
│   ├── model_weights.pth
│   ├── vocab.json
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/FaizaSoOmro256/CodeAlpha_MusicGeneratorAI.git

cd CodeAlpha_MusicGeneratorAI
```

---

## Backend Setup

Create a virtual environment:

```bash
python -m venv venv
```

Activate it.

Windows

```bash
venv\Scripts\activate
```

Linux/macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

(Optional) Train the baseline model:

```bash
python -c "from backend.dataset_generator import create_sample_midi_dataset; create_sample_midi_dataset(); from backend.trainer import ModelTrainer; trainer = ModelTrainer(); trainer.train(epochs=5)"
```

Run the backend:

```bash
uvicorn backend.main:app --reload
```

The API will be available at:

```
http://localhost:8000
```

Swagger API Documentation:

```
http://localhost:8000/docs
```

---

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

# ▶️ Running the Application

1. Start the FastAPI backend.

2. Start the React frontend.

3. Open the frontend in your browser.

4. Generate AI music from the Studio page.

5. Play generated music using the built-in synthesizer.

6. Export generated compositions as MIDI files.

# 🎯 How to Use

## Generate Music

1. Open the **Studio** page.
2. Select a music style or manually adjust the generation parameters.
3. Configure the temperature, tempo, sequence length, and musical scale.
4. Click **Generate Music** to create a new MIDI composition.

---

## Play Music

- Listen to generated compositions using the built-in WebAudio synthesizer.
- View generated notes through the interactive piano roll visualization.
- Switch between available instrument presets.

---

## Train a Custom Model

1. Navigate to the **Training** page.
2. Upload one or more MIDI files.
3. Configure the training parameters.
4. Start model training.
5. Monitor the training loss in real time.

---

## Export Music

Generated compositions can be downloaded as MIDI files and imported into Digital Audio Workstations (DAWs) such as:

- FL Studio
- Ableton Live
- Logic Pro
- Cubase
- LMMS
- GarageBand

---

# 🧠 Model Architecture

The music generation model is based on a Dual-Head Long Short-Term Memory (LSTM) neural network implemented using PyTorch.

The overall workflow consists of:

```
MIDI Dataset
      │
      ▼
MIDI Preprocessing
      │
      ▼
Sequence Tokenization
      │
      ▼
PyTorch LSTM Model
      │
      ▼
Pitch & Duration Prediction
      │
      ▼
MIDI Generation
      │
      ▼
Web Playback & Download
```

The model learns sequential musical patterns from MIDI files and predicts the next note and duration to generate new musical compositions.

---

# 📈 Future Improvements

The project is designed with scalability and future enhancements in mind.

## 🎨 User Interface & Experience

- Redesign the interface with a more modern and visually engaging user experience.
- Add advanced animations and interactive visualizations.
- Improve responsiveness across desktop, tablet, and mobile devices.
- Introduce customizable themes and accessibility enhancements.

---

## 🎼 Music Generation

- Support additional music genres and style presets.
- Improve harmonic consistency and rhythm generation.
- Generate multi-instrument compositions.
- Support longer and more complex musical structures.

---

## 🤖 AI Model Enhancements

- Evaluate Transformer-based music generation models.
- Integrate multiple AI models, including LSTM, Music Transformer, and MuseNet-style architectures.
- Improve generation quality using attention mechanisms.
- Allow users to select different AI models for music generation.

---

## 🌍 Platform Expansion

- Support additional languages for the user interface.
- Enable cloud-based music generation services.
- Provide cross-platform desktop and mobile applications.

---

## 📊 Additional Features

- Export compositions as MP3 and WAV files.
- Save and manage generated music libraries.
- Enable collaborative music generation.
- Provide AI-assisted melody editing and composition suggestions.

---

## ☁️ Deployment & Infrastructure

- Deploy the backend using scalable cloud infrastructure.
- Containerize the application using Docker.
- Implement CI/CD pipelines.
- Add user authentication and personalized workspaces.

---

# 🤝 Contributing

Contributions are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, distribute, and improve this project for personal, educational, and commercial purposes, provided that the original author is credited.

See the [LICENSE](LICENSE) file for more details.
---

# 👩‍💻 Author

**Faiza Soomro**

AI & Machine Learning Enthusiast

GitHub: https://github.com/FaizaSoOmro256

---

## 🙏 Acknowledgements

This project was developed as part of the **CodeAlpha AI Internship**. I sincerely thank **CodeAlpha** for providing the opportunity to work on real-world AI projects and strengthen my skills in Machine Learning, Deep Learning, and Full-Stack AI development.

Special thanks to the open-source community and the following technologies that made this project possible:

* CodeAlpha
* PyTorch
* FastAPI
* React
* Vite
* Tailwind CSS
* music21
* mido
* WebAudio API
* Chart.js
* Lucide React
* NumPy
* SciPy
* Python


## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub. Your support helps improve the project and encourages future development.
