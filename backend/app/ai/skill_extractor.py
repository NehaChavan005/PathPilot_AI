KNOWN_SKILLS = {"python", "sql", "javascript", "react", "fastapi", "docker", "git"}


def extract_skills(text: str) -> list[str]:
    return sorted(KNOWN_SKILLS.intersection(text.lower().split()))
