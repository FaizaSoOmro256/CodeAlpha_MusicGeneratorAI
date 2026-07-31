import os
import music21 as m21

def create_sample_midi_dataset(output_dir="backend/data/midi"):
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Bach Minuet snippet
    minuet = m21.stream.Score()
    p1 = m21.stream.Part()
    p1.append(m21.tempo.MetronomeMark(number=110))
    p1.append(m21.meter.TimeSignature('3/4'))
    p1.append(m21.key.Key('G'))
    
    # Melodic notes (pitch, quarter length)
    notes_bach = [
        ('D5', 1.0), ('G4', 0.5), ('A4', 0.5), ('B4', 0.5), ('C5', 0.5),
        ('D5', 1.0), ('G4', 1.0), ('G4', 1.0),
        ('E5', 1.0), ('C5', 0.5), ('D5', 0.5), ('E5', 0.5), ('F#5', 0.5),
        ('G5', 1.0), ('G4', 1.0), ('G4', 1.0),
        ('C5', 1.0), ('D5', 0.5), ('C5', 0.5), ('B4', 0.5), ('A4', 0.5),
        ('B4', 1.0), ('C5', 0.5), ('B4', 0.5), ('A4', 0.5), ('G4', 0.5),
        ('F#4', 1.0), ('G4', 0.5), ('A4', 0.5), ('B4', 0.5), ('G4', 0.5),
        ('A4', 2.0), ('D4', 1.0)
    ]
    for pitch, qlen in notes_bach:
        n = m21.note.Note(pitch)
        n.quarterLength = qlen
        p1.append(n)
    minuet.append(p1)
    minuet.write('midi', fp=os.path.join(output_dir, "bach_minuet.mid"))

    # 2. Beethoven Für Elise snippet
    fur_elise = m21.stream.Score()
    p2 = m21.stream.Part()
    p2.append(m21.tempo.MetronomeMark(number=130))
    p2.append(m21.meter.TimeSignature('3/8'))
    p2.append(m21.key.Key('A', 'minor'))
    
    notes_beethoven = [
        ('E5', 0.5), ('D#5', 0.5), ('E5', 0.5), ('D#5', 0.5), ('E5', 0.5), ('B4', 0.5), ('D5', 0.5), ('C5', 0.5),
        ('A4', 1.0), ('Rest', 0.5), ('C4', 0.5), ('E4', 0.5), ('A4', 0.5),
        ('B4', 1.0), ('Rest', 0.5), ('E4', 0.5), ('G#4', 0.5), ('B4', 0.5),
        ('C5', 1.0), ('Rest', 0.5), ('E4', 0.5), ('E5', 0.5), ('D#5', 0.5),
        ('E5', 0.5), ('D#5', 0.5), ('E5', 0.5), ('B4', 0.5), ('D5', 0.5), ('C5', 0.5),
        ('A4', 1.5)
    ]
    for pitch, qlen in notes_beethoven:
        if pitch == 'Rest':
            r = m21.note.Rest()
            r.quarterLength = qlen
            p2.append(r)
        else:
            n = m21.note.Note(pitch)
            n.quarterLength = qlen
            p2.append(n)
    fur_elise.append(p2)
    fur_elise.write('midi', fp=os.path.join(output_dir, "fur_elise.mid"))

    # 3. Jazz Blues 12-Bar Walk
    jazz = m21.stream.Score()
    p3 = m21.stream.Part()
    p3.append(m21.tempo.MetronomeMark(number=120))
    p3.append(m21.meter.TimeSignature('4/4'))
    
    # Chords and swing melodies
    notes_jazz = [
        ('C4', 0.5), ('E4', 0.5), ('G4', 0.5), ('A4', 0.5), ('Bb4', 0.5), ('A4', 0.5), ('G4', 0.5), ('E4', 0.5),
        ('F4', 0.5), ('A4', 0.5), ('C5', 0.5), ('D5', 0.5), ('Eb5', 0.5), ('D5', 0.5), ('C5', 0.5), ('A4', 0.5),
        ('C4', 0.5), ('E4', 0.5), ('G4', 0.5), ('A4', 0.5), ('Bb4', 1.0), ('G4', 1.0),
        ('G4', 0.5), ('B4', 0.5), ('D5', 0.5), ('F5', 0.5), ('F4', 0.5), ('A4', 0.5), ('C5', 0.5), ('Eb5', 0.5),
        ('C4', 1.0), ('Eb4', 0.5), ('E4', 0.5), ('G4', 1.0), ('C5', 1.0)
    ]
    for pitch, qlen in notes_jazz:
        n = m21.note.Note(pitch)
        n.quarterLength = qlen
        p3.append(n)
    jazz.append(p3)
    jazz.write('midi', fp=os.path.join(output_dir, "jazz_blues.mid"))

    # 4. Mozart Canon motif
    mozart = m21.stream.Score()
    p4 = m21.stream.Part()
    p4.append(m21.tempo.MetronomeMark(number=140))
    p4.append(m21.meter.TimeSignature('4/4'))
    
    notes_mozart = [
        ('C4', 1.0), ('E4', 1.0), ('G4', 1.0), ('C5', 1.0),
        ('B4', 0.5), ('C5', 0.5), ('D5', 1.0), ('G4', 2.0),
        ('A4', 1.0), ('F4', 1.0), ('D4', 1.0), ('B3', 1.0),
        ('C4', 2.0), ('Rest', 2.0),
        ('E4', 0.5), ('F4', 0.5), ('G4', 1.0), ('F4', 0.5), ('G4', 0.5), ('A4', 1.0),
        ('G4', 0.5), ('A4', 0.5), ('B4', 1.0), ('C5', 2.0)
    ]
    for pitch, qlen in notes_mozart:
        if pitch == 'Rest':
            r = m21.note.Rest()
            r.quarterLength = qlen
            p4.append(r)
        else:
            n = m21.note.Note(pitch)
            n.quarterLength = qlen
            p4.append(n)
    mozart.append(p4)
    mozart.write('midi', fp=os.path.join(output_dir, "mozart_canon.mid"))

    print(f"Generated sample MIDI dataset with 4 tracks in {output_dir}")

if __name__ == "__main__":
    create_sample_midi_dataset()
