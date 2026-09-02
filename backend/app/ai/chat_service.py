from .llm_service import LLMService


def answer(message: str, name: str | None = None) -> str:
    greeting = f"{name}, " if name else ""
    return greeting + LLMService().generate(message)
