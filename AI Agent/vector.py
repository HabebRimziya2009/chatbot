from langchain_chroma import Chroma
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings

import pdfplumber
from pathlib import Path

import os
import logging
import time

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
embedding_model = OpenAIEmbeddings(
    openai_api_key=None,
    model="text-embedding-3-small"
)

logging.basicConfig(level=logging.INFO)

BATCH_SIZE = 8  # Input token limit of 8000ish for this model, so 8 * 1000 = 8000 is max

# ChromaDB Database
vectorstore = Chroma(
    collection_name="faq_answers",
    embedding_function=embedding_model,
    persist_directory="./chroma_store"
)


def get_similar(query):
    output = vectorstore.similarity_search(query, k=5)
    formatted = "\n".join(
        f"From: {file.metadata.get('Model Name', 'Unknown Model')}\n{file.page_content}"
        for file in output
    )

    return formatted


def add_documents(documents):
    vectorstore.add_documents([Document(document) for document in documents])


def extract_text_from_pdf(file_path):
    try:
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
        return ""

    return text.strip()


def process_file(filepath):
    ext = Path(filepath).suffix.lower()
    documents = []

    if ext == ".pdf":
        print(f"Reading PDF: {filepath}")
        with pdfplumber.open(filepath) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""

        if not text.strip():
            logging.error(f"No text could be extracted from {filepath}")
            return

        documents.append(Document(text, metadata={"Model Name": Path(filepath).stem[:6]}))

    else:
        loader = TextLoader(filepath, encoding="utf-8")
        documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", "!", "?", " ", ""])
    chunks = splitter.split_documents(documents)

    logging.info(f"Number of chunks: {len(chunks)}")

    vectorstore.add_documents(chunks)

    time.sleep(3)


# Test
if __name__ == "__main__":
    question = input("Question: ")
    results = vectorstore.similarity_search_with_score(question, k=1)
    doc, score = results[0]
    print(doc, score)
