import re
from typing import Any
from backend.app.knowledge_graph.ontology import ROLE_SKILL_TAXONOMY, SKILL_METADATA
from backend.app.knowledge_graph.skill_graph import SkillGraph

SKILL_ALIASES: dict[str, str] = {
    "k8s": "Kubernetes",
    "js": "JavaScript",
    "ts": "TypeScript",
    "py": "Python",
    "ml": "Machine Learning",
    "dl": "Deep Learning",
    "nlp": "Natural Language Processing",
    "cv": "Computer Vision",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "tf": "TensorFlow",
    "reactjs": "React",
    "react.js": "React",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "node": "Node.js",
    "rest": "REST API",
    "restful": "REST API",
    "rest api": "REST API",
    "iac": "Infrastructure as Code",
    "dsa": "Data Structures",
    "algo": "Algorithms",
    "stats": "Statistics",
    "sklearn": "Scikit-Learn",
    "scikit learn": "Scikit-Learn",
    "aws": "Cloud Computing",
    "azure": "Cloud Computing",
    "gcp": "Cloud Computing",
}

ALL_CANONICAL_SKILLS: set[str] = {
    "Programming Fundamentals", "Python", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS",
    "SQL", "Git", "Linux", "Data Structures", "Algorithms", "Statistics", "Pandas", "Data Visualization",
    "Machine Learning", "Scikit-Learn", "Deep Learning", "PyTorch", "TensorFlow", "Natural Language Processing",
    "Computer Vision", "MLOps", "React", "Next.js", "Redux", "Node.js", "FastAPI", "Django", "Flask",
    "REST API", "Database Design", "PostgreSQL", "Redis", "Docker", "Kubernetes", "CI/CD",
    "Cloud Computing", "Infrastructure as Code", "Terraform", "Networking", "Security",
    "Cryptography", "Penetration Testing", "Big Data", "Data Pipelines", "Data Warehousing",
    "Apache Spark", "Kafka", "Prompt Engineering", "Vector Databases", "System Design", "Microservices"
}


def canonicalize_skill(name: str) -> str:
    """Normalize user skill string to canonical casing and alias resolution."""
    cleaned = name.strip().lower()
    if cleaned in SKILL_ALIASES:
        return SKILL_ALIASES[cleaned]

    for canon in ALL_CANONICAL_SKILLS:
        if canon.lower() == cleaned:
            return canon
    return name.strip().title()


def extract_skills(text: str) -> list[str]:
    """Extract all recognized technical skills from free-form text using phrase and token matching."""
    if not text:
        return []

    text_lower = text.lower()
    extracted: set[str] = set()

    # 1. Check multi-word canonical skills first
    for skill in sorted(ALL_CANONICAL_SKILLS, key=lambda s: len(s), reverse=True):
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, text_lower):
            extracted.add(skill)

    # 2. Check aliases
    for alias, canon in sorted(SKILL_ALIASES.items(), key=lambda a: len(a[0]), reverse=True):
        pattern = r"\b" + re.escape(alias) + r"\b"
        if re.search(pattern, text_lower):
            extracted.add(canon)

    # 3. Check single tokens
    tokens = set(re.findall(r"\b[a-zA-Z0-9+#.-]+\b", text_lower))
    for token in tokens:
        if token in SKILL_ALIASES:
            extracted.add(SKILL_ALIASES[token])
        for canon in ALL_CANONICAL_SKILLS:
            if canon.lower() == token:
                extracted.add(canon)

    return sorted(extracted)


def assess_skill_gaps(
    current_skills: list[str],
    target_role: str | None = None,
    target_skills: list[str] | None = None,
    graph: SkillGraph | None = None,
) -> dict[str, Any]:
    """Calculate skill gaps between current skills and target role requirements, with prerequisite prioritization."""
    if graph is None:
        graph = SkillGraph()

    canonical_current = {canonicalize_skill(s) for s in current_skills}
    required_set: set[str] = set()
    recommended_set: set[str] = set()

    # Resolve required skills from role taxonomy
    if target_role:
        for role_name, data in ROLE_SKILL_TAXONOMY.items():
            if role_name.lower() == target_role.strip().lower():
                required_set.update(data.get("required", []))
                recommended_set.update(data.get("recommended", []))
                break

    # Add custom target skills if supplied
    if target_skills:
        for s in target_skills:
            required_set.add(canonicalize_skill(s))

    if not required_set:
        # Fallback to general programming foundations if nothing specified
        required_set = {"Programming Fundamentals", "Python", "Git", "SQL"}

    # Compute acquired vs missing
    current_lower = {s.lower() for s in canonical_current}
    matching_skills = [s for s in required_set if s.lower() in current_lower]
    missing_required = [s for s in required_set if s.lower() not in current_lower]
    missing_recommended = [s for s in recommended_set if s.lower() not in current_lower]

    # Find missing foundational prerequisites using the DAG
    prereq_gaps = graph.find_missing_prerequisites(missing_required, list(canonical_current))

    # Prioritize gaps:
    # HIGH: Foundational prerequisites needed by other skills, or core required skills with zero unmet prerequisites
    # MEDIUM: Intermediate skills that require 1 prerequisite
    # LOW: Recommended/optional skills
    prioritized_gaps: list[dict[str, Any]] = []

    for skill in prereq_gaps:
        if skill not in missing_required:
            prioritized_gaps.append({
                "skill": skill,
                "priority": "HIGH",
                "reason": "Foundational prerequisite required before advanced topics",
                "prerequisites_needed": [],
                "difficulty": SKILL_METADATA.get(skill, {}).get("difficulty", "Beginner"),
            })

    for skill in missing_required:
        unmet = [p for p in graph.prerequisites_for(skill) if p.lower() not in current_lower]
        priority = "HIGH" if len(unmet) == 0 else "MEDIUM"
        prioritized_gaps.append({
            "skill": skill,
            "priority": priority,
            "reason": "Core required competency for target role" if priority == "HIGH" else f"Requires completion of {', '.join(unmet[:2])}",
            "prerequisites_needed": unmet,
            "difficulty": SKILL_METADATA.get(skill, {}).get("difficulty", "Intermediate"),
        })

    for skill in missing_recommended:
        prioritized_gaps.append({
            "skill": skill,
            "priority": "LOW",
            "reason": "Recommended/specialized skill for competitive advantage",
            "prerequisites_needed": [],
            "difficulty": SKILL_METADATA.get(skill, {}).get("difficulty", "Advanced"),
        })

    # Sort gaps by priority: HIGH -> MEDIUM -> LOW
    priority_weights = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    prioritized_gaps.sort(key=lambda g: priority_weights.get(g["priority"], 3))

    total_core = len(required_set)
    readiness_score = round((len(matching_skills) / total_core * 100), 1) if total_core > 0 else 0.0

    return {
        "target_role": target_role or "Custom",
        "current_skills": sorted(canonical_current),
        "matching_skills": sorted(matching_skills),
        "total_required": total_core,
        "readiness_score": readiness_score,
        "gaps_count": len(prioritized_gaps),
        "skill_gaps": prioritized_gaps,
    }
