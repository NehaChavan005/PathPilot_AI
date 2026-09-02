class LLMService:
    """Replace the deterministic fallback with a provider-backed client when configured."""
    def generate(self, prompt: str) -> str:
        return f"I can help you plan your learning next steps. {prompt}"
