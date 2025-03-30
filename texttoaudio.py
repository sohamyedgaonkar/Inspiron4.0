import pygame
from gtts import gTTS
from io import BytesIO

def speak(text):
    # Initialize pygame mixer
    pygame.mixer.init()
    
    # Convert text to speech
    tts = gTTS(text=text, lang='en')
    
    # Save the speech audio to a BytesIO object
    audio_stream = BytesIO()
    tts.write_to_fp(audio_stream)
    audio_stream.seek(0)
    
    # Load the audio stream into pygame mixer
    pygame.mixer.music.load(audio_stream, 'mp3')
    
    # Play the audio
    pygame.mixer.music.play()
    
    # Wait until the audio finishes playing
    while pygame.mixer.music.get_busy():
        continue

if __name__ == "__main__":
    text_to_speak = """You answered 5 questions.
Correct answers: 3
Incorrect answers: 2
You scored 60% which is less than 70%, so you didn't pass the interview."""
    speak(text_to_speak)
