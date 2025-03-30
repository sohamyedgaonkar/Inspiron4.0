import sounddevice as sd
import soundfile as sf
from transformers import pipeline

# Initialize the audio classification pipeline with your model
audio_pipe = pipeline("audio-classification", model="Hatman/audio-emotion-detection")

# Parameters for recording
duration = 5  # seconds
fs = 16000    # sample rate

print("Recording for 5 seconds...")

# Record audio from the microphone (mono channel)
audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='float32')
sd.wait()  # Wait until the recording is complete

print("Recording finished.")

# Save the recording to a temporary WAV file
temp_filename = "temp_audio.wav"
sf.write(temp_filename, audio_data, fs)

# Run the audio classification pipeline on the recorded file
result = audio_pipe(temp_filename)

print("Emotion detection results:")
print(result)
