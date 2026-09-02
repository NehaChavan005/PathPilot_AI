def tokenize_embedding(text: str) -> set[str]:
    """Lightweight development fallback for semantic matching."""
    return {word.lower().strip(".,!?") for word in text.split() if word}
