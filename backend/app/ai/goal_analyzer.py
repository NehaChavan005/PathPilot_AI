def analyze_goal(goal: str) -> dict[str, object]:
    words = [word for word in goal.split() if len(word) > 2]
    return {"goal": goal, "keywords": words[:10]}
