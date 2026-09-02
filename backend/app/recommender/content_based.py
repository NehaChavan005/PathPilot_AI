from app.ai.embeddings import tokenize_embedding


def similarity(query: str, content: str) -> float:
    left, right = tokenize_embedding(query), tokenize_embedding(content)
    return len(left & right) / len(left | right) if left or right else 0.0
