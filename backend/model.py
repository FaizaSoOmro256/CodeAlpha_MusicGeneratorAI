import torch
import torch.nn as nn
import torch.nn.functional as F

class MusicLSTM(nn.Module):
    def __init__(self, num_pitches, num_durations, embed_dim=64, hidden_dim=256, num_layers=2, dropout=0.2):
        super(MusicLSTM, self).__init__()
        self.num_pitches = num_pitches
        self.num_durations = num_durations
        
        self.pitch_embed = nn.Embedding(num_pitches, embed_dim)
        self.duration_embed = nn.Embedding(num_durations, embed_dim)
        
        # Combined embedding dimension: embed_dim * 2
        self.lstm = nn.LSTM(
            input_size=embed_dim * 2,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            dropout=dropout if num_layers > 1 else 0.0,
            batch_first=True
        )
        
        self.dropout = nn.Dropout(dropout)
        
        # Output heads for pitch and duration prediction
        self.fc_pitch = nn.Linear(hidden_dim, num_pitches)
        self.fc_duration = nn.Linear(hidden_dim, num_durations)

    def forward(self, x_pitch, x_duration, hidden=None):
        # x_pitch: (batch_size, seq_len)
        # x_duration: (batch_size, seq_len)
        p_embed = self.pitch_embed(x_pitch)
        d_embed = self.duration_embed(x_duration)
        
        # Concatenate embeddings
        x_embed = torch.cat([p_embed, d_embed], dim=-1) # (batch_size, seq_len, embed_dim * 2)
        
        lstm_out, hidden = self.lstm(x_embed, hidden) # (batch_size, seq_len, hidden_dim)
        lstm_out = self.dropout(lstm_out)
        
        # We predict using the output of the last sequence step
        last_step_out = lstm_out[:, -1, :] # (batch_size, hidden_dim)
        
        out_pitch = self.fc_pitch(last_step_out)     # (batch_size, num_pitches)
        out_duration = self.fc_duration(last_step_out) # (batch_size, num_durations)
        
        return out_pitch, out_duration, hidden
