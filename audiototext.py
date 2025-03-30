'''import sounddevice as sd
import wavio
import whisper

def record_audio(duration, fs=16000):
    """
    Record audio from the microphone.
    
    Parameters:
    - duration: Duration of the recording in seconds.
    - fs: Sampling rate (Hz).
    
    Returns:
    - A numpy array containing the recorded audio.
    """
    print("Recording...")
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()  # Wait until the recording is finished
    print("Recording complete!")
    return recording

def save_wav(filename, recording, fs=16000):
    """
    Save the recorded audio as a WAV file.
    
    Parameters:
    - filename: The output filename.
    - recording: The numpy array with recorded audio.
    - fs: Sampling rate (Hz).
    """
    wavio.write(filename, recording, fs, sampwidth=2)
    print(f"Audio saved as {filename}")

def transcribe_audio(filename):
    """
    Transcribe the audio file using Whisper.
    
    Parameters:
    - filename: The audio file to transcribe.
    
    Returns:
    - The transcribed text.
    """
    print("Loading Whisper model...")
    model = whisper.load_model("base")
    print("Transcribing audio...")
    result = model.transcribe(filename)
    return result["text"]

if __name__ == "__main__":
    duration = 5  # seconds, adjust as needed
    fs = 16000  # sample rate
    filename = "recording.wav"
    
    # Record audio and save to file
    recording = record_audio(duration, fs)
    save_wav(filename, recording, fs)
    
    # Transcribe the audio and print the result
    transcription = transcribe_audio(filename)
    print("Transcription:")
    print(transcription)'''

import sounddevice as sd
import numpy as np
import whisper

def record_audio(duration, fs=16000):
    """
    Record audio from the microphone for a given duration.
    
    Parameters:
      duration (float): Duration in seconds.
      fs (int): Sampling rate (Hz).
      
    Returns:
      np.ndarray: Recorded audio as a 1D float32 numpy array normalized to [-1, 1].
    """
    print("Recording...")
    # Record audio (channels=1 for mono)
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()  # Wait for the recording to finish
    print("Recording complete!")
    
    # Convert int16 recording to float32 normalized values
    audio = recording.astype(np.float32) / 32768.0
    # Flatten to a 1D array if needed
    return audio.flatten()

def main():
    # Load the Whisper model (using the "base" model as an example)
    print("Loading Whisper model...")
    model = whisper.load_model("base")
    
    fs = 16000       # Sampling rate
    duration = 5     # Duration of each recording in seconds
    
    print("Press Enter to start recording, or Ctrl+C to exit.")
    while True:
        input(f"\nPress Enter to record for {duration} seconds...")
        # Record audio from microphone without saving to a file
        audio = record_audio(duration, fs)
        
        # Transcribe the recorded audio
        print("Transcribing...")
        result = model.transcribe(audio,language="en")
        
        # Print the transcription result
        print("Transcription:")
        print(result["text"])

if __name__ == "__main__":
    main()

