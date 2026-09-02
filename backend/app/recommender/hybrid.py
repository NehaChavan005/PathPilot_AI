from .content_based import similarity
from .ranking import rank


def recommend(goal: str, items: list[dict]) -> list[dict]:
    return rank([(similarity(goal, f"{item.get('title', '')} {item.get('description', '')}"), item) for item in items])
