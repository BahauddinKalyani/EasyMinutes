# import pyaudio
import wave
import os
from termcolor import colored

from transformers import AutoTokenizer, AutoModelForCausalLM


def transcribe_chunk(model, audio):
    print('trascribing...')
    segments, _ = model.transcribe(audio, beam_size=5)
    final = ""
    for segment in segments:
        final += segment.text
    # print('trascribed...')
    return final


def record_chunk(audio_buffer, chunk_file):
    # return frames    
    wf = wave.open(chunk_file, 'wb' )
    wf.setnchannels(1)
    wf.setsampwidth(4)
    wf.setframerate(16000)
    wf.writeframes(b''+audio_buffer)
    wf.close()
    # with open(chunk_file, 'wb') as f:
    #     f.write(audio_buffer)
    # print('file written...')
    
def get_transcipts(model, audio_buffer):
    chunk_file = "output.wav"
    record_chunk(audio_buffer, chunk_file)
    transcription = transcribe_chunk(model, chunk_file)
    #  (transcription)
    print(colored(transcription, color="green"))
    # os.remove(chunk_file)
    # accumulated_transcription += transcription + " "
    return transcription


def abstract_summary_extraction(transcription, tokenizer, model):
   
    messages=[
        {
            "role": "system",
            "content": "You are a highly skilled AI trained in language comprehension and summarization. I would like you to read the following text and summarize it into a concise abstract paragraph. Aim to retain the most important points, providing a coherent and readable summary that could help a person understand the main points of the discussion without needing to read the entire text. Please avoid unnecessary details or tangential points."
        },
        {
            "role": "user",
            "content": transcription
        }
    ]
    input_ids = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt")
    
    gen_tokens = model.generate(
    input_ids, 
    max_new_tokens=100, 
    do_sample=True, 
    temperature=0.3,
    )
    
    gen_text = tokenizer.decode(gen_tokens[0])
    
    return gen_text


# def key_points_extraction(transcription):
#     response = client.chat.completions.create(
#         model="gpt-4",
#         temperature=0,
#         messages=[
#             {
#                 "role": "system",
#                 "content": "You are a proficient AI with a specialty in distilling information into key points. Based on the following text, identify and list the main points that were discussed or brought up. These should be the most important ideas, findings, or topics that are crucial to the essence of the discussion. Your goal is to provide a list that someone could read to quickly understand what was talked about."
#             },
#             {
#                 "role": "user",
#                 "content": transcription
#             }
#         ]
#     )
#     return completion.choices[0].message.content

# def action_item_extraction(transcription):
#     response = client.chat.completions.create(
#         model="gpt-4",
#         temperature=0,
#         messages=[
#             {
#                 "role": "system",
#                 "content": "You are an AI expert in analyzing conversations and extracting action items. Please review the text and identify any tasks, assignments, or actions that were agreed upon or mentioned as needing to be done. These could be tasks assigned to specific individuals, or general actions that the group has decided to take. Please list these action items clearly and concisely."
#             },
#             {
#                 "role": "user",
#                 "content": transcription
#             }
#         ]
#     )
#     return completion.choices[0].message.content


# def sentiment_analysis(transcription):
#     response = client.chat.completions.create(
#         model="gpt-4",
#         temperature=0,
#         messages=[
#             {
#                 "role": "system",
#                 "content": "As an AI with expertise in language and emotion analysis, your task is to analyze the sentiment of the following text. Please consider the overall tone of the discussion, the emotion conveyed by the language used, and the context in which words and phrases are used. Indicate whether the sentiment is generally positive, negative, or neutral, and provide brief explanations for your analysis where possible."
#             },
#             {
#                 "role": "user",
#                 "content": transcription
#             }
#         ]
#     )
#     return completion.choices[0].message.content

# def save_as_docx(minutes, filename):
#     doc = Document()
#     for key, value in minutes.items():
#         # Replace underscores with spaces and capitalize each word for the heading
#         heading = ' '.join(word.capitalize() for word in key.split('_'))
#         doc.add_heading(heading, level=1)
#         doc.add_paragraph(value)
#         # Add a line break between sections
#         doc.add_paragraph()
#     doc.save(filename)


def meeting_minutes(transcription, tokenizer, model):
    abstract_summary = abstract_summary_extraction(transcription, tokenizer, model)
    # key_points = key_points_extraction(transcription, tokenizer, model)
    # action_items = action_item_extraction(transcription, tokenizer, model)
    # sentiment = sentiment_analysis(transcription, tokenizer, model)
    return {
        'abstract_summary': abstract_summary,
        # 'key_points': key_points,
        # 'action_items': action_items,
        # 'sentiment': sentiment
    }

def generate_minutes(file_name, model_name="CohereForAI/c4ai-command-r-plus"):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)
    
    with open(file_name, "r") as file:
        transcription = file.read()
    
    minutes = meeting_minutes(transcription, tokenizer, model)
    print(minutes)
    return minutes

    # save_as_docx(minutes, 'meeting_minutes.docx')