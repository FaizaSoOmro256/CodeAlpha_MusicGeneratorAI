import os
import glob
import json
import numpy as np
import torch
import music21 as m21

class MIDIPreprocessor:
    def __init__(self, sequence_length=32):
        self.sequence_length = sequence_length
        self.pitch_to_int = {}
        self.int_to_pitch = {}
        self.duration_to_int = {}
        self.int_to_duration = {}
        self.pitches_vocab = []
        self.durations_vocab = []

    def parse_midi_file(self, file_path):
        """Parse a single MIDI file into (pitch, duration) tuples."""
        elements = []
        try:
            midi = m21.converter.parse(file_path)
            # Flatten to inspect all notes & chords
            parts = m21.instrument.partitionByInstrument(midi)
            if parts: # If instrument parts exist, pick main piano or first part
                notes_to_parse = parts.parts[0].recurse()
            else:
                notes_to_parse = midi.flat.notesAndRests

            for element in notes_to_parse:
                if isinstance(element, m21.note.Note):
                    pitch_str = str(element.pitch.midi)
                    dur_val = float(element.quarterLength)
                    elements.append((pitch_str, dur_val))
                elif isinstance(element, m21.chord.Chord):
                    # Represent chord as sorted pitch IDs joined by '.'
                    chord_pitches = ".".join(str(n.midi) for n in sorted(element.notes, key=lambda x: x.pitch.midi))
                    dur_val = float(element.quarterLength)
                    elements.append((chord_pitches, dur_val))
                elif isinstance(element, m21.note.Rest):
                    dur_val = float(element.quarterLength)
                    elements.append(("Rest", dur_val))

        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
        return elements

    def load_dataset(self, midi_dir="backend/data/midi"):
        """Load all MIDI files in directory and build vocabularies."""
        midi_files = glob.glob(os.path.join(midi_dir, "*.mid")) + glob.glob(os.path.join(midi_dir, "*.midi"))
        all_sequences = []

        raw_pitches = set()
        raw_durations = set()

        for fpath in midi_files:
            parsed = self.parse_midi_file(fpath)
            if parsed:
                all_sequences.append(parsed)
                for p, d in parsed:
                    raw_pitches.add(p)
                    raw_durations.add(d)

        # Build vocabulary mappings
        self.pitches_vocab = sorted(list(raw_pitches))
        self.durations_vocab = sorted(list(raw_durations))

        self.pitch_to_int = {p: i for i, p in enumerate(self.pitches_vocab)}
        self.int_to_pitch = {i: p for i, p in enumerate(self.pitches_vocab)}
        self.duration_to_int = {d: i for i, d in enumerate(self.durations_vocab)}
        self.int_to_duration = {i: d for i, d in enumerate(self.durations_vocab)}

        # Create training pairs (X_pitch, X_dur) -> (y_pitch, y_dur)
        X_p, X_d = [], []
        y_p, y_d = [], []

        for seq in all_sequences:
            if len(seq) <= self.sequence_length:
                continue
            for i in range(len(seq) - self.sequence_length):
                window = seq[i : i + self.sequence_length]
                target = seq[i + self.sequence_length]

                X_p.append([self.pitch_to_int[p] for p, d in window])
                X_d.append([self.duration_to_int[d] for p, d in window])

                y_p.append(self.pitch_to_int[target[0]])
                y_d.append(self.duration_to_int[target[1]])

        if len(X_p) == 0:
            print("Warning: No valid sequences created from MIDI files.")
            return None, None, None, None

        X_p_tensor = torch.tensor(X_p, dtype=torch.long)
        X_d_tensor = torch.tensor(X_d, dtype=torch.long)
        y_p_tensor = torch.tensor(y_p, dtype=torch.long)
        y_d_tensor = torch.tensor(y_d, dtype=torch.long)

        return (X_p_tensor, X_d_tensor), (y_p_tensor, y_d_tensor)

    def sequence_to_stream(self, generated_tuples, bpm=120):
        """Convert list of (pitch_str, duration_val) to a music21 stream."""
        stream = m21.stream.Stream()
        stream.append(m21.tempo.MetronomeMark(number=bpm))

        for item in generated_tuples:
            pitch_str, qlen = item
            if pitch_str == "Rest":
                r = m21.note.Rest()
                r.quarterLength = max(0.125, min(qlen, 4.0))
                stream.append(r)
            elif "." in pitch_str: # Chord
                try:
                    midi_notes = [int(p) for p in pitch_str.split(".")]
                    c = m21.chord.Chord(midi_notes)
                    c.quarterLength = max(0.125, min(qlen, 4.0))
                    stream.append(c)
                except Exception:
                    pass
            else: # Note
                try:
                    midi_val = int(pitch_str)
                    n = m21.note.Note(midi_val)
                    n.quarterLength = max(0.125, min(qlen, 4.0))
                    stream.append(n)
                except Exception:
                    pass
        return stream

    def save_vocab(self, json_path="backend/vocab.json"):
        data = {
            "pitch_to_int": self.pitch_to_int,
            "int_to_pitch": {str(k): v for k, v in self.int_to_pitch.items()},
            "duration_to_int": self.duration_to_int,
            "int_to_duration": {str(k): v for k, v in self.int_to_duration.items()},
            "pitches_vocab": self.pitches_vocab,
            "durations_vocab": self.durations_vocab
        }
        with open(json_path, "w") as f:
            json.dump(data, f, indent=2)

    def load_vocab(self, json_path="backend/vocab.json"):
        with open(json_path, "r") as f:
            data = json.load(f)
        self.pitch_to_int = data["pitch_to_int"]
        self.int_to_pitch = {int(k): v for k, v in data["int_to_pitch"].items()}
        self.duration_to_int = data["duration_to_int"]
        self.int_to_duration = {int(k): v for k, v in data["int_to_duration"].items()}
        self.pitches_vocab = data["pitches_vocab"]
        self.durations_vocab = data["durations_vocab"]
