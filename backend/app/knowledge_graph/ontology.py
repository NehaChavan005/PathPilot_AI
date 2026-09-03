"""Domain knowledge ontology defining roles, skill taxonomy, and prerequisite dependency graphs."""

ROLE_SKILL_TAXONOMY: dict[str, dict[str, list[str]]] = {
    "Data Scientist": {
        "required": ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "Data Visualization"],
        "recommended": ["Deep Learning", "Scikit-Learn", "Big Data", "Data Engineering", "MLOps"],
    },
    "Machine Learning Engineer": {
        "required": ["Python", "Data Structures", "Algorithms", "Machine Learning", "Deep Learning", "PyTorch"],
        "recommended": ["MLOps", "Docker", "TensorFlow", "Cloud Computing", "Natural Language Processing"],
    },
    "Full Stack Developer": {
        "required": ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "REST API", "Git"],
        "recommended": ["TypeScript", "FastAPI", "Docker", "Database Design", "CI/CD"],
    },
    "Frontend Developer": {
        "required": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Git", "REST API"],
        "recommended": ["Tailwind CSS", "Redux", "UI/UX Design", "Web Performance", "Next.js"],
    },
    "Backend Developer": {
        "required": ["Python", "FastAPI", "SQL", "Database Design", "REST API", "Docker", "Git"],
        "recommended": ["PostgreSQL", "Redis", "Microservices", "System Design", "CI/CD"],
    },
    "DevOps Engineer": {
        "required": ["Linux", "Git", "Docker", "Kubernetes", "CI/CD", "Cloud Computing"],
        "recommended": ["Infrastructure as Code", "Terraform", "Monitoring", "Python", "Bash"],
    },
    "Data Engineer": {
        "required": ["Python", "SQL", "Database Design", "Data Warehousing", "Data Pipelines", "Big Data"],
        "recommended": ["Apache Spark", "Kafka", "PostgreSQL", "Docker", "Cloud Computing"],
    },
    "Cloud Engineer": {
        "required": ["Cloud Computing", "Linux", "Networking", "Docker", "Infrastructure as Code", "Security"],
        "recommended": ["Kubernetes", "Terraform", "Python", "CI/CD", "Monitoring"],
    },
    "AI Engineer": {
        "required": ["Python", "Machine Learning", "Deep Learning", "Natural Language Processing", "PyTorch", "REST API"],
        "recommended": ["Docker", "MLOps", "Vector Databases", "Prompt Engineering", "Cloud Computing"],
    },
    "Cybersecurity Analyst": {
        "required": ["Networking", "Linux", "Security", "Cryptography", "Penetration Testing"],
        "recommended": ["Python", "Incident Response", "SIEM", "Cloud Security", "Git"],
    },
}

# (Prerequisite -> Skill) directed edges
PREREQUISITE_EDGES: list[tuple[str, str]] = [
    # Programming & Foundations
    ("Programming Fundamentals", "Python"),
    ("Programming Fundamentals", "JavaScript"),
    ("Python", "Data Structures"),
    ("JavaScript", "Data Structures"),
    ("Data Structures", "Algorithms"),

    # Data Science & ML
    ("Python", "Pandas"),
    ("Python", "SQL"),
    ("Python", "Statistics"),
    ("Pandas", "Data Visualization"),
    ("Statistics", "Machine Learning"),
    ("Python", "Machine Learning"),
    ("Machine Learning", "Scikit-Learn"),
    ("Machine Learning", "Deep Learning"),
    ("Deep Learning", "TensorFlow"),
    ("Deep Learning", "PyTorch"),
    ("Deep Learning", "Natural Language Processing"),
    ("Deep Learning", "Computer Vision"),
    ("Machine Learning", "MLOps"),
    ("Docker", "MLOps"),
    ("Natural Language Processing", "Prompt Engineering"),
    ("Natural Language Processing", "Vector Databases"),

    # Web & Backend Development
    ("HTML", "CSS"),
    ("HTML", "JavaScript"),
    ("CSS", "Tailwind CSS"),
    ("JavaScript", "TypeScript"),
    ("JavaScript", "React"),
    ("JavaScript", "Node.js"),
    ("React", "Next.js"),
    ("React", "Redux"),
    ("Python", "FastAPI"),
    ("FastAPI", "REST API"),
    ("Node.js", "REST API"),
    ("SQL", "Database Design"),
    ("Database Design", "PostgreSQL"),
    ("Database Design", "Data Warehousing"),
    ("Database Design", "Redis"),
    ("REST API", "Microservices"),
    ("Database Design", "System Design"),

    # DevOps & Infrastructure
    ("Linux", "Git"),
    ("Linux", "Docker"),
    ("Linux", "Networking"),
    ("Git", "CI/CD"),
    ("Docker", "Kubernetes"),
    ("Docker", "CI/CD"),
    ("Cloud Computing", "Kubernetes"),
    ("Cloud Computing", "Infrastructure as Code"),
    ("Infrastructure as Code", "Terraform"),
    ("Networking", "Security"),
    ("Security", "Cryptography"),
    ("Security", "Penetration Testing"),

    # Data Engineering
    ("SQL", "Data Warehousing"),
    ("Data Warehousing", "Big Data"),
    ("Python", "Data Pipelines"),
    ("Big Data", "Apache Spark"),
    ("Data Pipelines", "Kafka"),
]

# Estimated learning hours by difficulty level
SKILL_METADATA: dict[str, dict[str, object]] = {
    "Programming Fundamentals": {"difficulty": "Beginner", "hours": 20, "category": "foundations"},
    "Python": {"difficulty": "Beginner", "hours": 30, "category": "programming"},
    "JavaScript": {"difficulty": "Beginner", "hours": 30, "category": "programming"},
    "HTML": {"difficulty": "Beginner", "hours": 15, "category": "frontend"},
    "CSS": {"difficulty": "Beginner", "hours": 15, "category": "frontend"},
    "SQL": {"difficulty": "Beginner", "hours": 25, "category": "database"},
    "Git": {"difficulty": "Beginner", "hours": 10, "category": "tools"},
    "Linux": {"difficulty": "Beginner", "hours": 20, "category": "systems"},
    "Data Structures": {"difficulty": "Intermediate", "hours": 35, "category": "computer_science"},
    "Algorithms": {"difficulty": "Intermediate", "hours": 40, "category": "computer_science"},
    "Statistics": {"difficulty": "Intermediate", "hours": 30, "category": "data_science"},
    "Pandas": {"difficulty": "Intermediate", "hours": 20, "category": "data_science"},
    "Data Visualization": {"difficulty": "Beginner", "hours": 15, "category": "data_science"},
    "Machine Learning": {"difficulty": "Intermediate", "hours": 45, "category": "ai_ml"},
    "Scikit-Learn": {"difficulty": "Intermediate", "hours": 20, "category": "ai_ml"},
    "Deep Learning": {"difficulty": "Advanced", "hours": 50, "category": "ai_ml"},
    "PyTorch": {"difficulty": "Advanced", "hours": 35, "category": "ai_ml"},
    "TensorFlow": {"difficulty": "Advanced", "hours": 35, "category": "ai_ml"},
    "Natural Language Processing": {"difficulty": "Advanced", "hours": 40, "category": "ai_ml"},
    "MLOps": {"difficulty": "Advanced", "hours": 30, "category": "ai_ml"},
    "React": {"difficulty": "Intermediate", "hours": 35, "category": "frontend"},
    "TypeScript": {"difficulty": "Intermediate", "hours": 25, "category": "programming"},
    "Node.js": {"difficulty": "Intermediate", "hours": 30, "category": "backend"},
    "FastAPI": {"difficulty": "Intermediate", "hours": 25, "category": "backend"},
    "REST API": {"difficulty": "Intermediate", "hours": 15, "category": "backend"},
    "Database Design": {"difficulty": "Intermediate", "hours": 25, "category": "database"},
    "PostgreSQL": {"difficulty": "Intermediate", "hours": 20, "category": "database"},
    "Docker": {"difficulty": "Intermediate", "hours": 25, "category": "devops"},
    "Kubernetes": {"difficulty": "Advanced", "hours": 40, "category": "devops"},
    "CI/CD": {"difficulty": "Intermediate", "hours": 20, "category": "devops"},
    "Cloud Computing": {"difficulty": "Intermediate", "hours": 35, "category": "cloud"},
    "Infrastructure as Code": {"difficulty": "Advanced", "hours": 30, "category": "cloud"},
    "Networking": {"difficulty": "Intermediate", "hours": 25, "category": "systems"},
    "Security": {"difficulty": "Intermediate", "hours": 30, "category": "security"},
    "Big Data": {"difficulty": "Advanced", "hours": 40, "category": "data_engineering"},
    "Data Pipelines": {"difficulty": "Intermediate", "hours": 30, "category": "data_engineering"},
    "Prompt Engineering": {"difficulty": "Beginner", "hours": 15, "category": "ai_ml"},
    "Vector Databases": {"difficulty": "Intermediate", "hours": 20, "category": "ai_ml"},
}
