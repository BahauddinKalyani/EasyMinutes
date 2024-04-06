# import sounddevice as sd
import wave
# import soundfile as sf
# import librosa

def convert_to_wav(audio_buffer, sample_rate):
    # Check if conversion to 16 kHz is needed
    # if sample_rate != 16000:
    #     # Use a resampling library like soundfile (install with `pip install soundfile`)
    #     audio_buffer = librosa.resample(audio_buffer, orig_sr=sample_rate, target_sr=16000)

  # Convert audio data to 16-bit signed integers (assuming it's not already)
    # if audio_buffer.dtype != 'int16':
    #     audio_buffer = (audio_buffer * (2**15)).astype('int16')

  # Create a WAV file object
    wav_file = wave.open("output.wav", "wb")

#   # Set WAV parameters
    wav_file.setnchannels(1)  # 1 channel
    wav_file.setsampwidth(4)  # 2 bytes per sample (16-bit)
    wav_file.setframerate(48000)  # 16000 Hz sample rate

    # Write audio data to the WAV file
    wav_file.writeframes(audio_buffer)
    wav_file.close()

  # # Return the WAV data as a byte array (optional)
  # with open("output.wav", "rb") as f:
  #   wav_data = f.read()
  # return wav_data
