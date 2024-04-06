import numpy as np
from flask import Flask
from flask_socketio import SocketIO, emit
from geventwebsocket.handler import WebSocketHandler
from flask_cors import CORS
from faster_whisper import WhisperModel
from model_service import transcribe_chunk, generate_minutes
from audio_service import convert_to_wav
import wave
import os

import json

app = Flask(__name__)
CORS(app)
app.config['CORS_SUPPORTS_CREDENTIALS'] = False
# socketio = SocketIO(app, )
socketio = SocketIO(app, async_mode="gevent", handler_class=WebSocketHandler, max_http_buffer_size=10485760, cors_allowed_origins="*")

import os
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

model = None
i = 0
model_size = "small.en"
# model = WhisperModel("distil-medium.en", device="cpu", compute_type="int8")
model = WhisperModel(model_size, device="cuda", compute_type="int8")

@socketio.on('ping')
def handle_message(message):
    print('Received message:', message)
    # log.info('nfjk')
    socketio.emit('pong', 'pong')  # Echo the message back to the client

# audio_buffer = b''
@socketio.on('audio')
def handle_audio(audio_data):
    print('recie=ving............')
    global i
    deserialized_array = json.loads(audio_data)# Assuming numpy is installed
    list_data = list(deserialized_array.values())
    float32_array = np.array(list_data, dtype=np.float32)
    scaled_data = np.int16(float32_array * 32767)
    
    with wave.open('recording.wav', 'wb') as wav_file:
        wav_file.setnchannels(1)  # Assuming mono audio
        wav_file.setsampwidth(2)  # 16-bit samples (adjust if needed)
        wav_file.setframerate(16000)  # Desired sample rate
        wav_file.writeframes(scaled_data.tobytes())
        i=i+1
    global model
    transcripts = transcribe_chunk(model, 'recording.wav')
    socketio.emit('transcript', transcripts)
    with open('transcripts.txt', "a") as file:
        file.write(transcripts)

# @socketio.on('mom')
# def generate_mom(message):
#     print('generating mom...')
#     minutes = generate_minutes('transcript.txt')
#     emit('minutes', minutes)

@socketio.on("connect")
def handle_connect():
    # join_room(1)
    # user_data[user_sid] = {"frames": []}
    # print("Client connected started", user_sid)
    # global model
    # model_size = "small.en"
    # model = WhisperModel("distil-medium.en", device="cpu", compute_type="int8")
    # model = WhisperModel(model_size, device="cuda", compute_type="int8")
    print('Client connected')
    # socketio.emit('connected', "connected")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=8800, log_output=True)