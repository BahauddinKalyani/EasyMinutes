# import pyaudio
import wave
import os
from termcolor import colored
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from docx import Document

    
    
folder_path = 'models/action-item-summerizer/'  # Update this path
bert_tokenizer = BertTokenizer.from_pretrained(folder_path)
bert_model = BertForSequenceClassification.from_pretrained(folder_path).to(device)

t5_tokenizer = T5Tokenizer.from_pretrained("t5-small")
t5_model = T5ForConditionalGeneration.from_pretrained("t5-small").to(device)

def action_item_extraction(transcript):
    sentences = sent_tokenize(transcript)

    refined_phrases = []

    for sentence in sentences:
        inputs = bert_tokenizer.encode_plus(sentence, return_tensors="pt").to(device)
        with torch.no_grad():
            outputs = bert_model(**inputs)
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
        predicted_class = torch.argmax(probabilities, dim=-1).item()
        if predicted_class == 1:
            doc = nlp(sentence)
            for token in doc:
                if token.pos_ == "VERB":
                    action_phrase = token.text + ' ' + ' '.join(child.text for child in token.children if child.dep_ == "dobj")
                    if action_phrase:
                        # Rephrase the action phrase
                        input_ids = t5_tokenizer.encode(action_phrase, return_tensors="pt").to(device)
                        outputs = t5_model.generate(input_ids, max_length=50, num_beams=5, early_stopping=True)
                        refined_phrase = t5_tokenizer.decode(outputs[0], skip_special_tokens=True)
                        refined_phrases.append(refined_phrase)
                        break  # Only consider the first action verb

    return refined_phrases