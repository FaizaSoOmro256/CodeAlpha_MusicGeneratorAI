import os
import json
import random
import numpy as np
import torch
import torch.nn.functional as F
from backend.preprocessing import MIDIPreprocessor
from backend.model import MusicLSTM

SCALEOFFSETS = {
    "Major": [0, 2, 4, 5, 7, 9, 11],
    "Minor": [0, 2, 3, 5, 7, 8, 10],
    "Pentatonic": [0, 2, 4, 7, 9],
    "Blues": [0, 3, 5, 6, 7, 10],
    "Chromatic": list(range(12))
}

class MusicGenerator:
    def __init__(self, weights_path="backend/model_weights.pth", vocab_path="backend/vocab.json"):
        self.weights_path = weights_path
        self.vocab_path = vocab_path
        self.preprocessor = MIDIPreprocessor()

    def sample_with_temperature(self, logits, temperature=1.0):
        if temperature <= 0.01:
            return torch.argmax(logits, dim=-1).item()
        scaled_logits = logits / max(temperature, 1e-5)
        probs = F.softmax(scaled_logits, dim=-1).cpu().numpy()
        probs = probs / np.sum(probs) # Renormalize
        return np.random.choice(len(probs), p=probs)

    def generate(self, num_notes=64, temperature=0.8, bpm=120, scale_name="Chromatic", output_dir="backend/data/samples"):
        os.makedirs(output_dir, exist_ok=True)
        if not os.path.exists(self.vocab_path) or not os.path.exists(self.weights_path):
            # Fallback algorithmic generation if model not trained yet
            return self._generate_fallback(num_notes, bpm, scale_name, output_dir)

        self.preprocessor.load_vocab(self.vocab_path)
        checkpoint = torch.load(self.weights_path, map_location="cpu", weights_only=False)

        num_pitches = checkpoint["num_pitches"]
        num_durations = checkpoint["num_durations"]
        hidden_dim = checkpoint["hidden_dim"]
        num_layers = checkpoint["num_layers"]

        model = MusicLSTM(num_pitches, num_durations, embed_dim=64, hidden_dim=hidden_dim, num_layers=num_layers)
        model.load_state_dict(checkpoint["model_state_dict"])
        model.eval()

        # Create random seed sequence of length 32
        seed_pitches = [random.randint(0, num_pitches - 1) for _ in range(32)]
        seed_durations = [random.randint(0, num_durations - 1) for _ in range(32)]

        curr_p = torch.tensor([seed_pitches], dtype=torch.long)
        curr_d = torch.tensor([seed_durations], dtype=torch.long)

        generated = []
        scale_offsets = SCALEOFFSETS.get(scale_name, list(range(12)))

        with torch.no_grad():
            for _ in range(num_notes):
                out_p, out_d, _ = model(curr_p, curr_d)
                
                logits_p = out_p[0]
                logits_d = out_d[0]

                p_idx = self.sample_with_temperature(logits_p, temperature)
                d_idx = self.sample_with_temperature(logits_d, temperature)

                pitch_str = self.preprocessor.int_to_pitch.get(p_idx, "60")
                dur_val = self.preprocessor.int_to_duration.get(d_idx, 0.5)

                # Optional scale constraint
                if pitch_str != "Rest" and "." not in pitch_str and scale_name != "Chromatic":
                    try:
                        midi_val = int(pitch_str)
                        pitch_class = midi_val % 12
                        if pitch_class not in scale_offsets:
                            # Snap to nearest scale offset
                            nearest = min(scale_offsets, key=lambda x: abs(x - pitch_class))
                            midi_val = (midi_val // 12) * 12 + nearest
                            pitch_str = str(midi_val)
                    except Exception:
                        pass

                generated.append((pitch_str, dur_val))

                # Update current sequence sliding window
                new_p = torch.cat([curr_p[:, 1:], torch.tensor([[p_idx]])], dim=1)
                new_d = torch.cat([curr_d[:, 1:], torch.tensor([[d_idx]])], dim=1)
                curr_p, curr_d = new_p, new_d

        # Save generated stream to MIDI
        stream = self.preprocessor.sequence_to_stream(generated, bpm=bpm)
        filename = f"gen_{random.randint(1000,9999)}.mid"
        filepath = os.path.join(output_dir, filename)
        stream.write('midi', fp=filepath)

        return {
            "status": "success",
            "filename": filename,
            "filepath": filepath,
            "bpm": bpm,
            "num_notes": num_notes,
            "notes": generated
        }

    def _generate_fallback(self, num_notes, bpm, scale_name, output_dir):
        """Fallback pattern generator if weights don't exist yet."""
        scale_offsets = SCALEOFFSETS.get(scale_name, [0, 2, 4, 5, 7, 9, 11])
        base_midi = 60 # C4
        
        generated = []
        durations = [0.25, 0.5, 0.5, 1.0, 0.25, 0.5]
        
        for i in range(num_notes):
            if random.random() < 0.08:
                generated.append(("Rest", random.choice([0.5, 1.0])))
            elif random.random() < 0.15:
                # Chord
                root = base_midi + random.choice(scale_offsets)
                chord_str = f"{root}.{root+4}.{root+7}"
                generated.append((chord_str, random.choice([1.0, 2.0])))
            else:
                pitch = base_midi + random.choice(scale_offsets) + random.choice([0, 12, -12])
                dur = random.choice(durations)
                generated.append((str(pitch), dur))

        stream = self.preprocessor.sequence_to_stream(generated, bpm=bpm)
        filename = f"gen_sample_{random.randint(1000,9999)}.mid"
        filepath = os.path.join(output_dir, filename)
        stream.write('midi', fp=filepath)

        return {
            "status": "fallback",
            "filename": filename,
            "filepath": filepath,
            "bpm": bpm,
            "num_notes": num_notes,
            "notes": generated
        }
