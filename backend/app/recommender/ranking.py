def rank(items: list[tuple[float, object]]) -> list[object]:
    return [item for _, item in sorted(items, key=lambda pair: pair[0], reverse=True)]
