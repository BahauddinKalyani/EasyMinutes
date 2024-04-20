# import pyaudio
import wave
import os
from termcolor import colored
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from docx import Document

# Load the BERT classifier
classifier_folder_path = 'models/keypoints-summerizer/'  # Update this path
classifier_tokenizer = BertTokenizer.from_pretrained(classifier_folder_path)
classifier_model = BertForSequenceClassification.from_pretrained(classifier_folder_path).to(device)

# Load the BART model for summarization
summarizer_model_name = 'facebook/bart-large-cnn'
summarizer_tokenizer = BartTokenizer.from_pretrained(summarizer_model_name)
summarizer_model = BartForConditionalGeneration.from_pretrained(summarizer_model_name).to(device)

def key_points_extraction(transcript_sentences):
    # Function to classify sentences as action/non-action
    def classify_sentences(sentences):
        classifier_model.eval()
        action_sentences = []
        for sentence in sentences:
            inputs = classifier_tokenizer(sentence, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
            with torch.no_grad():
                outputs = classifier_model(**inputs)
            logits = outputs.logits
            predictions = torch.argmax(logits, dim=-1)
            if predictions == 1:  # Assuming '1' denotes action items
                action_sentences.append(sentence)
        return action_sentences

    # Function to generate summary from action sentences
    def generate_summary(sentences):
        summarizer_model.eval()
        input_text = " ".join(sentences)
        inputs = summarizer_tokenizer(input_text, return_tensors="pt", max_length=1024, truncation=True, padding="max_length").to(device)
        summary_ids = summarizer_model.generate(
            inputs['input_ids'],
            num_beams=5,
            max_length=80,
            min_length=20,
            length_penalty=0.5,
            early_stopping=True
        )
        return summarizer_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    # Classify and filter sentences
    action_sentences = classify_sentences(transcript_sentences)

    # Generate summary from action sentences
    if action_sentences:
        return generate_summary(action_sentences)
    else:
        return "No action items found."