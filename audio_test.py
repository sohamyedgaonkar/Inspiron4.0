import streamlit as st
import time
import numpy as np
import sounddevice as sd
import whisper
from gtts import gTTS
from io import BytesIO
from openai import OpenAI
import os
import base64 # Import base64 for data URI

# --- !!! FIRST STREAMLIT COMMAND !!! ---
st.set_page_config(layout="wide", page_title="AI Voice Interviewer")

# --- CSS to Hide Video Controls ---
# Targets the video element directly, suitable for st.html embedding
hide_video_controls_css = """
<style>
video {
    /* Hide the default controls */
    pointer-events: none; /* Disable interaction */
    width: 100% !important; /* Ensure it fills container width */
    height: auto !important; /* Maintain aspect ratio */
}
/* Attempt to explicitly hide controls across browsers */
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
/* Firefox specific */
video::-moz-media-controls {
    display: none !important;
}
/* Edge/IE specific (less likely needed) */
video::-ms-media-controls {
    display: none !important;
}
</style>
"""
st.markdown(hide_video_controls_css, unsafe_allow_html=True)

# --- Configuration ---
# --- IMPORTANT: SET YOUR NVIDIA API KEY HERE ---
API_KEY ="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" # <-- PASTE YOUR NVIDIA API KEY HERE
if API_KEY == "nvapi-...":
    st.error("Please set your NVIDIA API Key in the script (line 50).", icon="🔑")
    st.stop()

MODEL_NAME = "meta/llama3-70b-instruct" # Or "meta/llama3-8b-instruct"
WHISPER_MODEL = "base" # Options: "tiny", "base", "small", "medium", "large"
SAMPLE_RATE = 16000
RECORDING_DURATION_SECONDS = 15 # Duration for user recording
NUM_QUESTIONS = 5

# --- Asset Paths ---
# --- IMPORTANT: SET PATHS TO YOUR VIDEO AND IMAGE FILES ---
# Using raw strings (r"...") is good practice for Windows paths
# Make sure the video is encoded with H.264 codec for best browser compatibility
VIDEO_PATH = r"""c:\Users\DELL\Downloads\Untitled video - Made with Clipchamp (1).mp4"""
IMAGE_PATH = r"""c:\Users\DELL\Downloads\Capture.PNG"""

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
    st.error(f"Failed to read video file '{VIDEO_PATH}': {e}")
    st.stop()

try:
    with open(IMAGE_PATH, "rb") as f:
        image_bytes = f.read()
    print(f"Successfully read {len(image_bytes)} bytes from image file.")
except Exception as e:
    st.error(f"Failed to read image file '{IMAGE_PATH}': {e}")
    st.stop()

if not video_bytes:
    st.error("Video data could not be loaded (file might be empty?).")
    st.stop()
if not image_bytes:
    st.error("Image data could not be loaded (file might be empty?).")
    st.stop()

# --- Create Base64 Data URI for Video ---
video_data_uri = None
try:
    video_base64 = base64.b64encode(video_bytes).decode('utf-8')
    # Determine MIME type (common ones) - adjust if your video is different
    video_mime_type = "video/mp4" # Assume mp4, change if webm, ogg etc.
    video_data_uri = f"data:{video_mime_type};base64,{video_base64}"
    print("Created video data URI.")
except Exception as e:
    st.error(f"Failed to encode video to Base64: {e}")
    st.stop()

if not video_data_uri:
     st.error("Failed to create video data URI.")
     st.stop()

# --- Create HTML Video Tag String ---
# Using autoplay, loop, muted, playsinline attributes. controls="false" is redundant with CSS.
video_html = f"""
<video loop autoplay muted playsinline>
  <source src="{video_data_uri}" type="{video_mime_type}">
  Your browser does not support the video tag. Please ensure you are using a modern browser.
</video>
"""

# --- Backend Functions ---
@st.cache_resource
def load_whisper_model(model_name):
    """Loads the Whisper model using Streamlit's caching."""
    print(f"Loading Whisper model '{model_name}'...")
    try:
        model = whisper.load_model(model_name)
        print("Whisper model loaded successfully.")
        return model
    except Exception as e:
        st.error(f"Error loading Whisper model '{model_name}': {e}", icon="🤖")
        st.error("Ensure you have PyTorch installed and potentially ffmpeg available.")
        st.stop()
        return None # Should not be reached due to st.stop()

@st.cache_resource
def get_openai_client(api_key):
    """Initializes the OpenAI client for NVIDIA API using caching."""
    print("Initializing OpenAI client for NVIDIA API...")
    try:
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key,
        )
        # Optional: Add a simple test call here if needed
        print("OpenAI client initialized.")
        return client
    except Exception as e:
        st.error(f"Error initializing OpenAI client: {e}", icon="☁️")
        st.stop()
        return None

def record_audio(duration, fs):
    """Records audio from the default microphone."""
    print(f"Starting recording for {duration} seconds...")
    try:
        recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
        sd.wait() # Wait until recording is finished
        audio_np = recording.astype(np.float32) / 32768.0 # Normalize to [-1, 1]
        print("Recording finished.")
        return audio_np.flatten()
    except Exception as e:
        st.error(f"Audio recording failed: {e}", icon="🎤")
        st.error("Please ensure your microphone is connected, selected as default, and permissions are granted.", icon="⚙️")
        return None # Return None on failure

def transcribe_audio(audio_np, model, fs=SAMPLE_RATE):
    """Transcribes the given audio numpy array using the loaded Whisper model."""
    if audio_np is None or audio_np.size < fs * 0.5: # Check if audio exists and is reasonably long
        print("Transcription skipped: No valid audio data.")
        return ""
    print("Transcribing audio...")
    try:
        # Consider adding fp16=False if experiencing precision issues, though usually fine
        result = model.transcribe(audio_np, language="en")
        transcription = result.get("text", "").strip()
        print(f"Transcription result: '{transcription}'")
        return transcription
    except Exception as e:
        st.error(f"Error during transcription: {e}", icon="🎧")
        return "" # Return empty string on failure

def text_to_speech_bytes(text):
    """Converts text to speech audio bytes using gTTS."""
    if not text:
        print("TTS skipped: No text provided.")
        return None
    print(f"Generating speech for: '{text[:50]}...'")
    try:
        tts = gTTS(text=text, lang='en', slow=False) # slow=False for normal speed
        audio_stream = BytesIO()
        tts.write_to_fp(audio_stream)
        audio_stream.seek(0)
        print("Speech generation complete.")
        return audio_stream.getvalue()
    except Exception as e:
        st.error(f"Error during Text-to-Speech generation: {e}", icon="🗣️")
        return None # Return None on failure

# --- Streamlit App Title/Markdown ---
st.title("🎙️ AI Voice Interviewer")
st.markdown("Answer the interviewer's questions using your voice. The interviewer video will play automatically while speaking.")

# --- Initialization ---
whisper_model_instance = load_whisper_model(WHISPER_MODEL)
openai_client = get_openai_client(API_KEY)

# --- Candidate Skillset (Can be adjusted here) ---
candidate_skillset = """
Problem Solving: Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP), Database Management Systems (DBMS), Operating Systems (OS)
Programming Languages: C++, Java, Python, JavaScript
AI and ML Domain: Natural Language Processing (NLP), Computer Vision (CV), Optical Character Recognition (OCR), Generative AI (GenAI)
Web Development: HTML, CSS, JavaScript, React.js, Node.js (Express), Python (Flask, Django), Git version control, GitHub
Database Systems: MySQL, SQLite, PostgreSQL, Firebase (NoSQL)
"""

# --- System Prompt ---
system_prompt = f"""
You are an AI Interviewer simulating a technical screening interview.
Your goal is to assess the candidate based on the provided skillset.

**Candidate's Skillset:**
{candidate_skillset}

**Interview Flow:**
1.  **Ask Exactly {NUM_QUESTIONS} Questions:** Ask one question at a time, relevant to the candidate's skillset. Vary the topics if possible. Start with the first question immediately.
2.  **Receive Answer:** Wait for the candidate's answer (which will be provided as text).
3.  **Internal Evaluation (Keep Silent):** For each answer, internally assess if it's reasonably correct or incorrect based on common technical knowledge. Do *not* mention "Correct" or "Incorrect" to the user after each answer. Silently keep track of the counts.
4.  **Ask Next Question:** If fewer than {NUM_QUESTIONS} questions have been asked, proceed immediately to the next question without filler phrases like "Okay, next question..." or "Good answer...". Just state the question.
5.  **Final Summary (After {NUM_QUESTIONS} Answers):** After receiving the answer to the {NUM_QUESTIONS}th question, DO NOT ask another question. Instead, immediately provide the final summary starting *exactly* with "Thank you for appearing for the interview." followed by:
    *   A "Summary:" line with the total count of correct and incorrect answers (e.g., "Summary: Correct answers: 4, Incorrect answers: 1.").
    *   A "Result:" line stating "Pass" if the number of correct answers is {int(NUM_QUESTIONS * 0.7)} or more, otherwise state "Fail".
    *   If the result is "Fail", add a "Revise:" line suggesting 1-3 general skill areas (e.g., "Revise: DSA, DBMS") based on the questions answered incorrectly. Be concise.

**Example Final Output (Pass):**
Thank you for appearing for the interview.
Summary: Correct answers: 4, Incorrect answers: 1.
Result: Pass

**Example Final Output (Fail):**
Thank you for appearing for the interview.
Summary: Correct answers: 2, Incorrect answers: 3.
Result: Fail
Revise: OOP, Web Development Fundamentals

**Important Rules:**
*   **Be Concise:** Only output the question itself or the final summary message exactly as specified.
*   **No External Details:** Do not reveal your internal thought process, the evaluation of specific answers, or the running score until the final summary.
*   **Stick to the Count:** Ask exactly {NUM_QUESTIONS} questions before concluding.
"""

# --- Session State Initialization ---
if 'conversation' not in st.session_state:
    # Initialize with only the system prompt
    st.session_state.conversation = [{"role": "system", "content": system_prompt}]
if 'question_count' not in st.session_state:
    st.session_state.question_count = 0
if 'interview_state' not in st.session_state:
    # States: 'start', 'waiting_for_answer', 'processing_answer', 'show_summary', 'finished'
    st.session_state.interview_state = 'start'
if 'audio_to_play' not in st.session_state:
    st.session_state.audio_to_play = None # Holds TTS audio bytes
if 'show_video' not in st.session_state:
    st.session_state.show_video = False # Controls display of video vs image
if 'current_interviewer_text' not in st.session_state:
    st.session_state.current_interviewer_text = "Initializing interview..." # Text to display below video
if 'last_user_transcription' not in st.session_state:
    st.session_state.last_user_transcription = "" # Last thing user said

# --- UI Layout ---
col1, col2 = st.columns([0.6, 0.4]) # Left for media, Right for chat

with col1:
    # --- Display Video (using st.html) or Image based on state ---
    if st.session_state.show_video:
        try:
            # Embed the HTML video tag with autoplay, loop, muted
            # Adjust height if needed, but width=100% from CSS is usually best
            st.html(video_html) # Adjust height as desired
            # Display interviewer text below video
            if st.session_state.current_interviewer_text and \
               st.session_state.current_interviewer_text != "Initializing interview...":
                st.info(f"Interviewer: {st.session_state.current_interviewer_text}")
        except Exception as e:
            st.error(f"Streamlit failed to display video HTML: {e}", icon="🖼️")
            # Optional: Fallback to st.image if HTML fails unexpectedly
            if image_bytes: st.image(image_bytes)

    else: # Show static image
        if image_bytes:
            try:
                st.image(image_bytes, use_column_width=True) # Fill column width
                # Status text below image
                if st.session_state.interview_state == 'processing_answer':
                    st.write("Processing your answer...")
                elif st.session_state.interview_state == 'waiting_for_answer' and st.session_state.question_count > 0:
                     st.write("Waiting for you to record...")
                elif st.session_state.last_user_transcription:
                    st.caption(f"*(You said: {st.session_state.last_user_transcription})*") # Use caption for smaller text
                elif st.session_state.interview_state == 'start':
                     st.write("Initializing...")
                elif st.session_state.interview_state == 'finished':
                    st.write("Interview finished.")
                else:
                    st.write("Ready...") # Default/fallback text
            except Exception as e:
                st.error(f"Streamlit failed to display image: {e}", icon="🖼️")
        else:
            st.warning("Image data is not available to display.")

    # --- Placeholder for speaker audio (using st.audio) ---
    audio_placeholder = st.empty()
    with audio_placeholder.container(): # Use container to manage the audio element
         if st.session_state.audio_to_play:
            try:
                print("Attempting to play audio...")
                st.audio(st.session_state.audio_to_play, format="audio/mp3", autoplay=True)
                # Don't clear audio_to_play here; let state changes handle replacement/removal
            except Exception as e:
                st.error(f"Streamlit failed to play audio: {e}", icon="🔊")


with col2:
    st.subheader("Conversation Log")
    # Use a container with fixed height for scrollable chat history
    chat_placeholder = st.container(height=450, border=False)
    # Placeholder for the recording button
    controls_placeholder = st.empty()

    # --- Display Conversation History ---
    with chat_placeholder:
        # Filter out system prompt and initial placeholder message
        display_messages = [
            msg for msg in st.session_state.conversation
            if msg["role"] != "system" and
               not (msg["role"] == "assistant" and msg["content"] == "Please ask the first interview question.")
        ]
        for msg in display_messages:
            with st.chat_message(msg["role"]):
                 # Display user message with a note about voice input
                 if msg["role"] == "user":
                     st.markdown(f"*(Via voice):* {msg['content']}")
                 else:
                     st.markdown(msg['content']) # Use markdown for potential formatting in LLM response

# --- Main Interview Logic Function ---
def call_llm():
    """Calls the LLM, updates state, generates audio."""
    if not openai_client:
        st.error("LLM Client not initialized.", icon="☁️")
        st.session_state.interview_state = 'finished'
        return

    # Prepare messages: Send only system + user/assistant turns
    messages_to_send = [msg for msg in st.session_state.conversation if msg["role"] != "system" or msg == st.session_state.conversation[0]] # Include system only once at start

    print(f"Calling LLM. State: {st.session_state.interview_state}, Q#: {st.session_state.question_count}")
    try:
        completion = openai_client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages_to_send,
            temperature=0.4, # Slightly higher for potentially more varied questions, but still focused
            top_p=0.9,
            max_tokens=300, # Allow slightly longer responses for summary/questions
            stream=False
        )
        assistant_reply = completion.choices[0].message.content.strip()
        print(f"LLM Raw Reply: '{assistant_reply}'")

        if not assistant_reply:
            assistant_reply = "Sorry, I encountered an issue generating a response. Let's try again."
            print("Warning: LLM returned empty response.")
            # Don't add empty response to history, potentially retry or ask user to repeat

        # Update conversation history *before* checking content
        st.session_state.conversation.append({"role": "assistant", "content": assistant_reply})
        st.session_state.current_interviewer_text = assistant_reply # Update text displayed below video

        # Check for interview conclusion phrase
        if "Thank you for appearing for the interview" in assistant_reply:
             st.session_state.interview_state = 'show_summary'
             st.session_state.show_video = True # Keep video for final message
             st.session_state.audio_to_play = text_to_speech_bytes(assistant_reply)
             print("Interview concluded by LLM.")
        # Check if LLM failed to conclude after expected number of questions
        elif st.session_state.question_count >= NUM_QUESTIONS:
             st.warning("Reached question limit, but LLM did not provide summary. Ending interview.")
             # Force conclusion manually if LLM missed the cue
             final_manual_summary = "Thank you for appearing for the interview. (Could not generate final score summary)."
             st.session_state.conversation.append({"role": "assistant", "content": final_manual_summary})
             st.session_state.current_interviewer_text = final_manual_summary
             st.session_state.interview_state = 'show_summary' # Treat as summary display state
             st.session_state.show_video = True
             st.session_state.audio_to_play = text_to_speech_bytes(final_manual_summary)
        else:
             # It's a regular question, prepare for next user answer
             st.session_state.interview_state = 'waiting_for_answer'
             st.session_state.show_video = True # Show video while asking question
             st.session_state.audio_to_play = text_to_speech_bytes(assistant_reply)
             print("Proceeding to wait for user answer.")

    except Exception as e:
        print(f"Error calling LLM: {e}")
        st.error(f"An error occurred while communicating with the AI: {e}", icon="☁️")
        error_message = "Sorry, there was a connection error. Please try refreshing."
        st.session_state.current_interviewer_text = error_message
        st.session_state.audio_to_play = text_to_speech_bytes(error_message)
        st.session_state.show_video = True # Show video even for error message
        st.session_state.interview_state = 'finished' # Stop interview on major error


# --- State Machine Logic ---

# State: 'start' -> Get the first question from LLM
if st.session_state.interview_state == 'start':
    print("State: start")
    # Check if conversation already contains a real assistant message (e.g., after refresh/error)
    has_assistant_message = any(msg["role"] == "assistant" and msg["content"] != "Please ask the first interview question." for msg in st.session_state.conversation)

    if not has_assistant_message:
        with st.spinner("Connecting to interviewer..."):
            # Add placeholder only if no actual assistant message exists yet
            if not any(msg["role"] == "assistant" for msg in st.session_state.conversation):
                 st.session_state.conversation.append({"role": "assistant", "content": "Please ask the first interview question."})
            call_llm() # This will update state to 'waiting_for_answer' and trigger rerun
            st.rerun() # Ensure UI updates after LLM call completes
    else:
        # Already started, maybe due to refresh. Move to waiting state.
        print("Start state skipped: Assistant message already exists.")
        st.session_state.interview_state = 'waiting_for_answer'
        st.session_state.show_video = True # Ensure video is shown
        # Don't rerun here, let the rest of the script execute for the 'waiting' state

# State: 'waiting_for_answer' -> Show video/question/audio and Record button
elif st.session_state.interview_state == 'waiting_for_answer':
    print("State: waiting_for_answer")
    st.session_state.show_video = True # Ensure video is showing
    # Display the recording button in its placeholder
    with controls_placeholder:
        # Use a unique key to ensure Streamlit recognizes the button state correctly on reruns
        if st.button(f"🎤 Record Answer ({RECORDING_DURATION_SECONDS}s)", key=f"record_q_{st.session_state.question_count}"):
            st.session_state.interview_state = 'processing_answer'
            st.session_state.show_video = False # Switch to static image during recording/processing
            st.session_state.audio_to_play = None # Stop any ongoing TTS playback
            st.session_state.last_user_transcription = "" # Clear previous transcription
            print("Record button clicked. Moving to processing_answer state.")
            st.rerun() # Rerun immediately to switch UI for recording

# State: 'processing_answer' -> Record, Transcribe, Send to LLM
elif st.session_state.interview_state == 'processing_answer':
    print("State: processing_answer")
    st.session_state.show_video = False # Ensure static image is showing
    st.session_state.audio_to_play = None # Ensure no TTS is playing

    user_transcription = ""
    audio_data = None

    # Record Audio
    with st.spinner(f"Listening... (Speak for {RECORDING_DURATION_SECONDS} seconds)"):
        audio_data = record_audio(RECORDING_DURATION_SECONDS, SAMPLE_RATE)

    # Transcribe Audio if recording was successful
    if audio_data is not None:
        with st.spinner("Transcribing your answer..."):
            if whisper_model_instance:
                user_transcription = transcribe_audio(audio_data, whisper_model_instance)
                st.session_state.last_user_transcription = user_transcription # Store for display below image
            else:
                st.error("Transcription model not loaded.", icon="🤖")
                st.session_state.interview_state = 'waiting_for_answer' # Go back

    # Process Transcription if valid
    if user_transcription:
        print(f"Transcription successful: '{user_transcription}'")
        st.session_state.question_count += 1
        # Add user's answer to conversation history
        st.session_state.conversation.append({"role": "user", "content": user_transcription})

        # Call LLM for next question or summary
        with st.spinner("Interviewer is processing your answer..."):
            call_llm() # LLM call updates state and sets show_video=True

    # Handle cases where transcription failed or recording was too short/empty
    elif audio_data is not None: # Recording happened but transcription was empty
        print("Warning: Transcription was empty or failed.")
        st.warning("Could not understand audio or it was silent. Please try recording again.", icon="🤔")
        st.session_state.interview_state = 'waiting_for_answer' # Go back to allow re-recording
        st.session_state.show_video = True # Show video again for the re-prompt / waiting state
    # else: audio_data was None (recording failed, error already shown) -> Stay in processing or move back? Let's move back.
    elif audio_data is None:
        print("Processing aborted due to recording failure.")
        st.session_state.interview_state = 'waiting_for_answer' # Go back after recording error

    # Rerun to reflect the state change (either to waiting_for_answer or finished/summary)
    st.rerun()

# State: 'show_summary' -> Display final message and summary video/audio
elif st.session_state.interview_state == 'show_summary':
    print("State: show_summary")
    st.session_state.show_video = True # Ensure video plays for the final message
    st.success("Interview Concluded.")
    # Don't disable button yet, wait for 'finished' state
    # Automatically transition to 'finished' after showing summary once
    st.session_state.interview_state = 'finished'
    # No immediate rerun needed here, let the 'finished' state logic handle the final UI
    # If audio/video doesn't play, might need a targeted rerun after a short delay, but try without first.

# State: 'finished' -> Show static image, final message, disable controls
elif st.session_state.interview_state == 'finished':
    print("State: finished")
    st.session_state.show_video = False # Switch back to static image
    st.session_state.audio_to_play = None # Ensure no audio is playing
    st.balloons() # Fun effect for conclusion
    with controls_placeholder:
        st.info("Interview session has ended. Refresh the page to start again.")
    # The final interviewer message is already in the chat log and displayed there.
    # The static image is displayed by the logic in col1 when show_video is False.

# --- Final Separator for Logs ---
print("-" * 40)