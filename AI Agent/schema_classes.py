from pydantic import BaseModel, Field


class AnswerStructure(BaseModel):
    answer: str = Field(description="The answer to the user's question")
    tool: bool = Field(description="What tool is needed?")


class AskRequest(BaseModel):
    question: str
