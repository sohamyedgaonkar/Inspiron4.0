import streamlit as st
import cv2
import time
import numpy as np
import sounddevice as sd
import whisper
from transformers import pipeline
from gtts import gTTS
from io import BytesIO
from openai import OpenAI
import os
import base64
from collections import Counter
from PIL import Image

# --- Streamlit Page Configuration ---
st.set_page_config(layout="wide", page_title="AI Voice Interviewer with Emotion Feedback")

# --- CSS to Hide Video Controls ---
hide_video_controls_css = """
<style>
video {
    pointer-events: none;
    width: 100% !important;
    height: auto !important;
}
video::-webkit-media-controls-panel,
video::-webkit-media-controls-play-button,
video::-webkit-media-controls-timeline,
video::-webkit-media-controls-current-time-display,
video::-webkit-media-controls-time-remaining-display,
video::-webkit-media-controls-mute-button,
video::-webkit-media-controls-volume-slider,
video::-webkit-media-controls-fullscreen-button {
    display: none !important;
    -webkit-appearance: none;
}
video::-moz-media-controls {
    display: none !important;
}
video::-ms-media-controls {
    display: none !important;
}
</style>
"""
st.markdown(hide_video_controls_css, unsafe_allow_html=True)

# --- Configuration ---
API_KEY = "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"  # Set your NVIDIA API key here
if API_KEY == "nvapi-...":
    st.error("Please set your NVIDIA API Key in the script.", icon="🔑")
    st.stop()

MODEL_NAME = "meta/llama3-70b-instruct"  # Or "meta/llama3-8b-instruct"
WHISPER_MODEL = "base"
SAMPLE_RATE = 16000
RECORDING_DURATION_SECONDS = 15
NUM_QUESTIONS = 5

# --- Asset Paths (change these to your actual paths) ---
VIDEO_PATH = r"D:\COEP HACK\Untitled video - Made with Clipchamp (1).mp4"
IMAGE_PATH = r"D:\COEP HACK\Capture.PNG"

# --- File Existence Check & Load Bytes ---
if not os.path.exists(VIDEO_PATH):
    st.error(f"Video file not found at: {VIDEO_PATH}", icon="🚨")
    st.stop()
if not os.path.exists(IMAGE_PATH):
    st.error(f"Image file not found at: {IMAGE_PATH}", icon="🚨")
    st.stop()

video_bytes = None
image_bytes = None
try:
    with open(VIDEO_PATH, "rb") as f:
        video_bytes = f.read()
    print(f"Successfully read {len(video_bytes)} bytes from video file.")
except Exception as e:
    st.error(f"Failed to read video file: {e}")
    st.stop()

try:
    with open(IMAGE_PATH, "rb") as f:
        image_bytes = f.read()
    print(f"Successfully read {len(image_bytes)} bytes from image file.")
except Exception as e:
    st.error(f"Failed to read image file: {e}")
    st.stop()

if not video_bytes:
    st.error("Video data could not be loaded.")
    st.stop()
if not image_bytes:
    st.error("Image data could not be loaded.")
    st.stop()

# --- Create Base64 Data URI for Video ---
try:
    video_base64 = base64.b64encode(video_bytes).decode('utf-8')
    video_mime_type = "video/mp4"
    video_data_uri = f"data:{video_mime_type};base64,{video_base64}"
    print("Created video data URI.")
except Exception as e:
    st.error(f"Failed to encode video: {e}")
    st.stop()

# --- Create HTML Video Tag String ---
video_html = f"""
<video loop autoplay muted playsinline>
  <source src="{video_data_uri}" type="{video_mime_type}">
  Your browser does not support the video tag.
</video>
"""

# ---------------------------
# Emotion Detection Function
# ---------------------------
def capture_emotion():
    """
    Captures one frame from the webcam using the DirectShow backend (for Windows)
    and returns the detected emotion using a pre-trained pipeline.
    """
    try:
        cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        if not cap.isOpened():
            st.error("Cannot open webcam for emotion capture.")
            return None

        ret, frame = cap.read()
        cap.release()
        if not ret:
            st.error("Failed to capture frame for emotion detection.")
            return None

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(rgb_frame)

        if 'emotion_pipe' not in st.session_state:
            st.session_state.emotion_pipe = pipeline("image-classification", model="prithivMLmods/Facial-Emotion-Detection-SigLIP2")
        pipe = st.session_state.emotion_pipe

        predictions = pipe(pil_image)
        if predictions:
            detected_emotion = predictions[0]['label']
            return detected_emotion
        else:
            return None
    except Exception as e:
        st.error(f"Error during emotion capture: {e}")
        return None

# ---------------------------
# Caching Models and Clients
# ---------------------------
@st.cache_resource
def load_whisper_model(model_name):
    print(f"Loading Whisper model '{model_name}'...")
    try:
        model = whisper.load_model(model_name)
        print("Whisper model loaded successfully.")
        return model
    except Exception as e:
        st.error(f"Error loading Whisper model '{model_name}': {e}", icon="🤖")
        st.stop()

@st.cache_resource
def get_openai_client(api_key):
    print("Initializing OpenAI client for NVIDIA API...")
    try:
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key,
        )
        print("OpenAI client initialized.")
        return client
    except Exception as e:
        st.error(f"Error initializing OpenAI client: {e}", icon="☁")
        st.stop()

whisper_model_instance = load_whisper_model(WHISPER_MODEL)
openai_client = get_openai_client(API_KEY)

# ---------------------------
# Audio & Transcription Functions
# ---------------------------
def record_audio(duration, fs):
    print(f"Starting recording for {duration} seconds...")
    try:
        recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
        sd.wait()
        audio_np = recording.astype(np.float32) / 32768.0
        print("Recording finished.")
        return audio_np.flatten()
    except Exception as e:
        st.error(f"Audio recording failed: {e}", icon="🎤")
        return None

def transcribe_audio(audio_np, model, fs=SAMPLE_RATE):
    if audio_np is None or audio_np.size < fs * 0.5:
        print("Transcription skipped: No valid audio data.")
        return ""
    print("Transcribing audio...")
    try:
        result = model.transcribe(audio_np, language="en")
        transcription = result.get("text", "").strip()
        print(f"Transcription result: '{transcription}'")
        return transcription
    except Exception as e:
        st.error(f"Error during transcription: {e}", icon="🎧")
        return ""

def text_to_speech_bytes(text):
    if not text:
        print("TTS skipped: No text provided.")
        return None
    print(f"Generating speech for: '{text[:50]}...'")
    try:
        tts = gTTS(text=text, lang='en', slow=False)
        audio_stream = BytesIO()
        tts.write_to_fp(audio_stream)
        audio_stream.seek(0)
        print("Speech generation complete.")
        return audio_stream.getvalue()
    except Exception as e:
        st.error(f"Error during TTS generation: {e}", icon="🗣")
        return None

# ---------------------------
# Session State Initialization
# ---------------------------
if 'conversation' not in st.session_state:
    system_prompt = f"""
You are an AI Interviewer simulating a technical screening interview.
Your goal is to assess the candidate based on their responses.

*Interview Flow:*
1. Ask exactly {NUM_QUESTIONS} questions.
2. Wait for the candidate's answer (via voice).
3. Internally evaluate each answer without disclosing evaluation.
4. After {NUM_QUESTIONS} answers, provide a final summary starting with "Thank you for appearing for the interview."
5. The final summary should include a "Feedback" section based solely on the candidate's captured emotions.

*Example Final Output (Pass):*
Thank you for appearing for the interview.
Summary: Correct answers: 4, Incorrect answers: 1.
Result: Pass

*Example Final Output (Fail):*
Thank you for appearing for the interview.
Summary: Correct answers: 2, Incorrect answers: 3.
Result: Fail
Revise: DSA, OOP
"""
    st.session_state.conversation = [{"role": "system", "content": system_prompt}]
if 'question_count' not in st.session_state:
    st.session_state.question_count = 0
if 'interview_state' not in st.session_state:
    st.session_state.interview_state = 'start'
if 'audio_to_play' not in st.session_state:
    st.session_state.audio_to_play = None
if 'show_video' not in st.session_state:
    st.session_state.show_video = False
if 'current_interviewer_text' not in st.session_state:
    st.session_state.current_interviewer_text = "Initializing interview..."
if 'last_user_transcription' not in st.session_state:
    st.session_state.last_user_transcription = ""
if 'emotions' not in st.session_state:
    st.session_state.emotions = []

# ---------------------------
# UI Layout
# ---------------------------
col1, col2 = st.columns([0.6, 0.4])
with col1:
    if st.session_state.show_video:
        try:
            st.html(video_html)
            if st.session_state.current_interviewer_text and st.session_state.current_interviewer_text != "Initializing interview...":
                st.info(f"Interviewer: {st.session_state.current_interviewer_text}")
        except Exception as e:
            st.error(f"Error displaying video: {e}", icon="🖼")
            if image_bytes: st.image(image_bytes, use_container_width=True)
    else:
        if image_bytes:
            try:
                st.image(image_bytes, use_container_width=True)
                if st.session_state.interview_state == 'processing_answer':
                    st.write("Processing your answer...")
                elif st.session_state.interview_state == 'waiting_for_answer' and st.session_state.question_count > 0:
                    st.write("Waiting for you to record...")
                elif st.session_state.last_user_transcription:
                    st.caption(f"(You said: {st.session_state.last_user_transcription})")
                elif st.session_state.interview_state == 'start':
                    st.write("Initializing...")
                elif st.session_state.interview_state == 'finished':
                    st.write("Interview finished.")
                else:
                    st.write("Ready...")
            except Exception as e:
                st.error(f"Error displaying image: {e}", icon="🖼")
        else:
            st.warning("Image data is not available.")

    audio_placeholder = st.empty()
    with audio_placeholder.container():
         if st.session_state.audio_to_play:
            try:
                st.audio(st.session_state.audio_to_play, format="audio/mp3", autoplay=True)
            except Exception as e:
                st.error(f"Error playing audio: {e}", icon="🔊")

with col2:
    st.subheader("Conversation Log")
    chat_placeholder = st.container()
    controls_placeholder = st.empty()

    with chat_placeholder:
        display_messages = [
            msg for msg in st.session_state.conversation
            if msg["role"] != "system" and not (msg["role"] == "assistant" and msg["content"] == "Please ask the first interview question.")
        ]
        for msg in display_messages:
            with st.chat_message(msg["role"]):
                if msg["role"] == "user":
                    st.markdown(f"(Via voice): {msg['content']}")
                else:
                    st.markdown(msg["content"])

# ---------------------------
# LLM Call Function
# ---------------------------
def call_llm():
    if not openai_client:
        st.error("LLM Client not initialized.", icon="☁")
        st.session_state.interview_state = 'finished'
        return

    messages_to_send = [msg for msg in st.session_state.conversation if msg["role"] != "system" or msg == st.session_state.conversation[0]]
    print(f"Calling LLM. State: {st.session_state.interview_state}, Q#: {st.session_state.question_count}")
    try:
        completion = openai_client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages_to_send,
            temperature=0.4,
            top_p=0.9,
            max_tokens=300,
            stream=False
        )
        assistant_reply = completion.choices[0].message.content.strip()
        print(f"LLM Raw Reply: '{assistant_reply}'")

        if not assistant_reply:
            assistant_reply = "Sorry, I encountered an issue generating a response. Let's try again."
            print("Warning: LLM returned empty response.")

        st.session_state.conversation.append({"role": "assistant", "content": assistant_reply})
        st.session_state.current_interviewer_text = assistant_reply

        if "Thank you for appearing for the interview" in assistant_reply:
             st.session_state.interview_state = 'show_summary'
             st.session_state.show_video = True
             st.session_state.audio_to_play = text_to_speech_bytes(assistant_reply)
             print("Interview concluded by LLM.")
        elif st.session_state.question_count >= NUM_QUESTIONS:
             st.warning("Reached question limit, but LLM did not provide summary. Ending interview.")
             final_manual_summary = "Thank you for appearing for the interview. (Could not generate final score summary)."
             st.session_state.conversation.append({"role": "assistant", "content": final_manual_summary})
             st.session_state.current_interviewer_text = final_manual_summary
             st.session_state.interview_state = 'show_summary'
             st.session_state.show_video = True
             st.session_state.audio_to_play = text_to_speech_bytes(final_manual_summary)
        else:
             st.session_state.interview_state = 'waiting_for_answer'
             st.session_state.show_video = True
             st.session_state.audio_to_play = text_to_speech_bytes(assistant_reply)
             print("Proceeding to wait for user answer.")
    except Exception as e:
        print(f"Error calling LLM: {e}")
        st.error(f"Error communicating with the AI: {e}", icon="☁")
        error_message = "Sorry, there was a connection error. Please try refreshing."
        st.session_state.current_interviewer_text = error_message
        st.session_state.audio_to_play = text_to_speech_bytes(error_message)
        st.session_state.show_video = True
        st.session_state.interview_state = 'finished'

# ---------------------------
# State Machine Logic
# ---------------------------
if st.session_state.interview_state == 'start':
    print("State: start")
    has_assistant_message = any(msg["role"] == "assistant" and msg["content"] != "Please ask the first interview question." for msg in st.session_state.conversation)
    if not has_assistant_message:
        with st.spinner("Connecting to interviewer..."):
            if not any(msg["role"] == "assistant" for msg in st.session_state.conversation):
                 st.session_state.conversation.append({"role": "assistant", "content": "Please ask the first interview question."})
            call_llm()
            st.rerun()
    else:
        print("Start state skipped: Assistant message exists.")
        st.session_state.interview_state = 'waiting_for_answer'
        st.session_state.show_video = True

elif st.session_state.interview_state == 'waiting_for_answer':
    print("State: waiting_for_answer")
    st.session_state.show_video = True
    with controls_placeholder:
        if st.button(f"🎤 Record Answer ({RECORDING_DURATION_SECONDS}s)", key=f"record_q_{st.session_state.question_count}"):
            st.session_state.interview_state = 'processing_answer'
            st.session_state.show_video = False
            st.session_state.audio_to_play = None
            st.session_state.last_user_transcription = ""
            print("Record button clicked. Moving to processing_answer state.")
            st.rerun()

elif st.session_state.interview_state == 'processing_answer':
    print("State: processing_answer")
    st.session_state.show_video = False
    st.session_state.audio_to_play = None

    user_transcription = ""
    audio_data = record_audio(RECORDING_DURATION_SECONDS, SAMPLE_RATE)

    if audio_data is not None:
        with st.spinner(f"Transcribing your answer..."):
            if whisper_model_instance:
                user_transcription = transcribe_audio(audio_data, whisper_model_instance)
                st.session_state.last_user_transcription = user_transcription
            else:
                st.error("Transcription model not loaded.", icon="🤖")
                st.session_state.interview_state = 'waiting_for_answer'

    if user_transcription:
        print(f"Transcription successful: '{user_transcription}'")
        st.session_state.question_count += 1
        st.session_state.conversation.append({"role": "user", "content": user_transcription})
        
        # Capture emotion snapshot after answer
        detected_emotion = capture_emotion()
        if detected_emotion:
            st.session_state.emotions.append(detected_emotion)
            print(f"Captured emotion: {detected_emotion}")
        else:
            print("No emotion detected for this answer.")
        
        with st.spinner("Interviewer is processing your answer..."):
            call_llm()
    elif audio_data is not None:
        st.warning("Could not understand audio or it was silent. Please try recording again.", icon="🤔")
        st.session_state.interview_state = 'waiting_for_answer'
        st.session_state.show_video = True

    st.rerun()

elif st.session_state.interview_state == 'show_summary':
    print("State: show_summary")
    st.session_state.show_video = True
    st.success("Interview Concluded.")
    st.session_state.interview_state = 'finished'
    
    # Generate feedback solely based on captured emotions (do not pass to LLM)
    if st.session_state.emotions:
        emotion_counts = Counter(st.session_state.emotions)
        most_common_emotion, count = emotion_counts.most_common(1)[0]
        if most_common_emotion.lower() == "happy":
            feedback_message = "Great job! Your expressions suggest confidence and positivity."
        elif most_common_emotion.lower() == "nervous":
            feedback_message = "It seems you were nervous. Consider practicing to build more confidence."
        else:
            feedback_message = "Your expressions were neutral. Try to be more expressive to convey enthusiasm. Speak clear and stay confident."
    else:
        feedback_message = "No emotion data was captured."
    
    final_summary = (
        "Thank you for appearing for the interview.\n"
        "Summary: Correct answers: X, Incorrect answers: Y.\n"
        "Result: [Pass/Fail]\n"
    )
    # Print the summary and then a dedicated Feedback section
    st.write(final_summary)
    st.subheader("Feedback")
    st.write(feedback_message)
    
    # Optionally, add these details to the conversation log and update TTS output.
    st.session_state.conversation.append({"role": "assistant", "content": final_summary + "\nFeedback: " + feedback_message})
    st.session_state.current_interviewer_text = final_summary + "\nFeedback: " + feedback_message
    st.session_state.audio_to_play = text_to_speech_bytes(final_summary + "\nFeedback: " + feedback_message)

elif st.session_state.interview_state == 'finished':
    print("State: finished")
    st.session_state.show_video = False
    st.session_state.audio_to_play = None
    st.balloons()
    with controls_placeholder:
        st.info("Interview session has ended. Refresh the page to start again.")

print("-" * 40)
