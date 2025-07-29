import google.generativeai as genai
import json
# import vector
# import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# Allow only chatbot site
# noinspection PyTypeChecker
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://euphonious-alfajores-3ae39a.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key="AIzaSyCvxwnQ3w0ENoTe5u68W1-HXTdgKlspBAk")
TEMP_CHAT_HISTORY = []


def generate_prompt(query, context):
    with open("prompt.txt", "r") as file:
        prompt = ''.join(
            '\n' if line == '\n' or line.rstrip('\n').endswith(':') else line.rstrip('\n')
            for line in file
        )

    return prompt.format(query=query, context=context)


class AnswerStructure:
    answer: str
    tool: str


@app.post("/ask")
def ask_bot(query):
    print('Loading...')
    context = ""  # TODO: Replace with vector.get_similar(query)
    prompt = generate_prompt(query, context)

    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            response_mime_type="application/json",
            response_schema=list[AnswerStructure],
        )
    )

    chat = model.start_chat()

    response = chat.send_message(prompt)
    data = json.loads(response.text)[0]

    print(data)

    _answer = data["answer"]
    _tool = bool(data["tool"]) if "tool" in data.keys() else False

    TEMP_CHAT_HISTORY.append({"role": "user", "message": _answer})
    TEMP_CHAT_HISTORY.append({"role": "bot", "message": _answer})

    return _answer, _tool
