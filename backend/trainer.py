import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader
from backend.preprocessing import MIDIPreprocessor
from backend.model import MusicLSTM

class ModelTrainer:
    def __init__(self, midi_dir="backend/data/midi", weights_path="backend/model_weights.pth", vocab_path="backend/vocab.json"):
        self.midi_dir = midi_dir
        self.weights_path = weights_path
        self.vocab_path = vocab_path
        self.is_training = False
        self.last_loss = 0.0
        self.loss_history = []

    def train(self, epochs=25, batch_size=16, lr=0.003, hidden_dim=256, num_layers=2, callback=None):
        self.is_training = True
        self.loss_history = []

        preprocessor = MIDIPreprocessor(sequence_length=32)
        X_data, y_data = preprocessor.load_dataset(self.midi_dir)

        if X_data is None:
            self.is_training = False
            return {"status": "error", "message": "No dataset found or dataset empty."}

        X_p, X_d = X_data
        y_p, y_d = y_data

        preprocessor.save_vocab(self.vocab_path)

        dataset = TensorDataset(X_p, X_d, y_p, y_d)
        dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

        num_pitches = len(preprocessor.pitches_vocab)
        num_durations = len(preprocessor.durations_vocab)

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = MusicLSTM(num_pitches, num_durations, embed_dim=64, hidden_dim=hidden_dim, num_layers=num_layers)
        model.to(device)

        criterion_pitch = nn.CrossEntropyLoss()
        criterion_duration = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=lr)

        model.train()
        for epoch in range(1, epochs + 1):
            if not self.is_training: # Allows cancelling
                break
            
            total_loss = 0.0
            batches = 0
            for batch_xp, batch_xd, batch_yp, batch_yd in dataloader:
                batch_xp = batch_xp.to(device)
                batch_xd = batch_xd.to(device)
                batch_yp = batch_yp.to(device)
                batch_yd = batch_yd.to(device)

                optimizer.zero_grad()
                out_p, out_d, _ = model(batch_xp, batch_xd)

                loss_p = criterion_pitch(out_p, batch_yp)
                loss_d = criterion_duration(out_d, batch_yd)
                loss = loss_p + loss_d

                loss.backward()
                optimizer.step()

                total_loss += loss.item()
                batches += 1

            avg_loss = total_loss / max(1, batches)
            self.last_loss = avg_loss
            self.loss_history.append({"epoch": epoch, "loss": round(avg_loss, 4)})

            if callback:
                callback(epoch, epochs, round(avg_loss, 4))

        # Save model state
        torch.save({
            "model_state_dict": model.state_dict(),
            "num_pitches": num_pitches,
            "num_durations": num_durations,
            "hidden_dim": hidden_dim,
            "num_layers": num_layers
        }, self.weights_path)

        self.is_training = False
        return {
            "status": "success",
            "epochs": epochs,
            "final_loss": round(self.last_loss, 4),
            "num_pitches": num_pitches,
            "num_durations": num_durations,
            "loss_history": self.loss_history
        }

    def stop_training(self):
        self.is_training = False
