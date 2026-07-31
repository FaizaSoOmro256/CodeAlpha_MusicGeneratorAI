import os
import glob
import asyncio
import threading
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import torch

from backend.dataset_generator import create_sample_midi_dataset
from backend.preprocessing import MIDIPreprocessor
from backend.trainer import ModelTrainer
from backend.generator import MusicGenerator

app = FastAPI(title="AI Music Generator API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MIDI_DIR = "backend/data/midi"
SAMPLES_DIR = "backend/data/samples"
WEIGHTS_PATH = "backend/model_weights.pth"
VOCAB_PATH = "backend/vocab.json"

os.makedirs(MIDI_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)

trainer = ModelTrainer(midi_dir=MIDI_DIR, weights_path=WEIGHTS_PATH, vocab_path=VOCAB_PATH)
generator = MusicGenerator(weights_path=WEIGHTS_PATH, vocab_path=VOCAB_PATH)

# Active WebSocket connections for training updates
active_websockets = set()

class TrainParams(BaseModel):
    epochs: int = 20
    batch_size: int = 16
    lr: float = 0.003
    hidden_dim: int = 256
    num_layers: int = 2

class GenerateParams(BaseModel):
    num_notes: int = 64
    temperature: float = 0.8
    bpm: int = 120
    scale_name: str = "Chromatic"

@app.on_event("startup")
def startup_event():
    # Ensure sample dataset exists
    if len(glob.glob(os.path.join(MIDI_DIR, "*.mid"))) == 0:
        create_sample_midi_dataset(MIDI_DIR)

@app.get("/api/status")
def get_status():
    has_weights = os.path.exists(WEIGHTS_PATH)
    has_vocab = os.path.exists(VOCAB_PATH)
    midi_files = glob.glob(os.path.join(MIDI_DIR, "*.mid"))
    return {
        "device": "cuda" if torch.cuda.is_available() else "cpu",
        "is_training": trainer.is_training,
        "has_trained_model": has_weights and has_vocab,
        "dataset_files_count": len(midi_files),
        "last_loss": trainer.last_loss
    }

@app.get("/api/dataset")
def get_dataset_info():
    preprocessor = MIDIPreprocessor()
    midi_files = glob.glob(os.path.join(MIDI_DIR, "*.mid"))
    file_info = []

    for fpath in midi_files:
        basename = os.path.basename(fpath)
        notes = preprocessor.parse_midi_file(fpath)
        file_info.append({
            "name": basename,
            "path": fpath,
            "note_count": len(notes)
        })

    return {
        "file_count": len(file_info),
        "files": file_info
    }

@app.post("/api/dataset/generate-samples")
def generate_sample_dataset():
    create_sample_midi_dataset(MIDI_DIR)
    return {"status": "success", "message": "Created sample dataset with 4 MIDI files"}

@app.websocket("/ws/train")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_websockets.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_websockets.remove(websocket)

def notify_training_progress(epoch, total_epochs, loss):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    msg = {
        "type": "progress",
        "epoch": epoch,
        "total_epochs": total_epochs,
        "loss": loss
    }
    for ws in list(active_websockets):
        try:
            loop.run_until_complete(ws.send_json(msg))
        except Exception:
            pass

@app.post("/api/train")
def start_training(params: TrainParams):
    if trainer.is_training:
        return {"status": "error", "message": "Training already in progress"}

    def run_in_thread():
        trainer.train(
            epochs=params.epochs,
            batch_size=params.batch_size,
            lr=params.lr,
            hidden_dim=params.hidden_dim,
            num_layers=params.num_layers,
            callback=notify_training_progress
        )

    t = threading.Thread(target=run_in_thread)
    t.start()

    return {"status": "success", "message": "Training started in background"}

@app.post("/api/train/stop")
def stop_training():
    trainer.stop_training()
    return {"status": "success", "message": "Training stop signal sent"}

@app.post("/api/generate")
def generate_music(params: GenerateParams):
    result = generator.generate(
        num_notes=params.num_notes,
        temperature=params.temperature,
        bpm=params.bpm,
        scale_name=params.scale_name,
        output_dir=SAMPLES_DIR
    )
    return result

@app.get("/api/samples")
def list_samples():
    sample_files = glob.glob(os.path.join(SAMPLES_DIR, "*.mid"))
    samples = []
    for fpath in sample_files:
        basename = os.path.basename(fpath)
        samples.append({
            "name": basename,
            "path": fpath,
            "created_at": os.path.getmtime(fpath)
        })
    samples.sort(key=lambda x: x["created_at"], reverse=True)
    return {"samples": samples}

@app.get("/api/download/{filename}")
def download_midi(filename: str):
    fpath = os.path.join(SAMPLES_DIR, filename)
    if not os.path.exists(fpath):
        fpath = os.path.join(MIDI_DIR, filename)
    if os.path.exists(fpath):
        return FileResponse(fpath, media_type="audio/midi", filename=filename)
    return {"error": "File not found"}

@app.post("/api/upload")
async def upload_midi(file: UploadFile = File(...)):
    if not file.filename.endswith(('.mid', '.midi')):
        return {"error": "Only MIDI files are allowed"}
    dest = os.path.join(MIDI_DIR, file.filename)
    with open(dest, "wb") as f:
        content = await file.read()
        f.write(content)
    return {"status": "success", "filename": file.filename}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
