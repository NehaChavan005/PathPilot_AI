from sqlalchemy.orm import Session

from backend.app.database.connection import SessionLocal
from backend.app.models import (
    User,
    LearnerProfile,
    Skill,
    LearnerSkill,
    Prerequisite,
    Course,
    CourseSkill,
    Enrollment,
    Progress,
)
from backend.app.utils.security import hash_password

SKILLS = [
    # Programming
    ("Python", "Programming", "General-purpose programming with Python"),
    ("JavaScript", "Programming", "Programming for web applications"),
    ("Data Structures", "Programming", "Core data structures and algorithms"),
    ("Object Oriented Programming", "Programming", "OOP principles and design"),
    ("Git", "Tools", "Version control with Git"),

    # Data
    ("SQL", "Data", "Relational databases and SQL"),
    ("Statistics", "Data Science", "Statistical concepts for data analysis"),
    ("Data Analysis", "Data Science", "Analyzing and interpreting datasets"),
    ("Pandas", "Data Science", "Python library for data manipulation"),
    ("NumPy", "Data Science", "Numerical computing with Python"),

    # Machine Learning
    ("Machine Learning", "AI/ML", "Supervised and unsupervised machine learning"),
    ("Scikit-learn", "AI/ML", "Machine learning with scikit-learn"),
    ("Feature Engineering", "AI/ML", "Creating useful features for ML models"),
    ("Model Evaluation", "AI/ML", "Evaluating machine learning models"),

    # Deep Learning
    ("Deep Learning", "AI/ML", "Neural networks and deep learning"),
    ("TensorFlow", "AI/ML", "Deep learning with TensorFlow"),
    ("PyTorch", "AI/ML", "Deep learning with PyTorch"),
    ("Computer Vision", "AI/ML", "Image and video understanding"),

    # NLP / GenAI
    ("NLP", "AI/ML", "Natural language processing"),
    ("Transformers", "Generative AI", "Transformer-based architectures"),
    ("Generative AI", "Generative AI", "Generative artificial intelligence"),
    ("LLMs", "Generative AI", "Large language models"),
    ("Prompt Engineering", "Generative AI", "Designing effective prompts"),
    ("RAG", "Generative AI", "Retrieval augmented generation"),

    # Backend
    ("FastAPI", "Backend", "Building APIs with FastAPI"),
    ("Flask", "Backend", "Python web development with Flask"),
    ("REST APIs", "Backend", "RESTful API architecture"),

    # Frontend
    ("HTML/CSS", "Web Development", "Frontend page structure and styling"),
    ("React", "Web Development", "Building interfaces with React"),
    ("TypeScript", "Web Development", "Typed JavaScript development"),

    # Cloud / DevOps
    ("Linux", "Cloud/DevOps", "Linux operating system"),
    ("Docker", "Cloud/DevOps", "Containerization with Docker"),
    ("Kubernetes", "Cloud/DevOps", "Container orchestration"),
    ("AWS", "Cloud", "Amazon Web Services"),
    ("Azure", "Cloud", "Microsoft Azure"),
    ("DevOps", "Cloud/DevOps", "Development and operations practices"),
    ("MLOps", "AI/ML", "Machine learning operations"),

    # Cybersecurity
    ("Cybersecurity", "Security", "Fundamentals of cybersecurity"),
    ("Networking", "Security", "Computer networking fundamentals"),
    ("Network Security", "Security", "Securing computer networks"),
    ("SIEM", "Security", "Security information and event management"),
    ("Splunk", "Security", "Security monitoring using Splunk"),
    ("Cloud Security", "Security", "Security for cloud environments"),
]


COURSES = [
    # -------------------------
    # PROGRAMMING
    # -------------------------

    {
        "title": "Python Programming Fundamentals",
        "description": "Learn Python syntax, variables, conditions, loops, functions and modules.",
        "category": "Programming",
        "difficulty": "beginner",
        "duration": 20,
        "provider": "PathPilot Academy",
        "skills": ["Python"],
    },

    {
        "title": "Advanced Python Programming",
        "description": "Learn advanced Python concepts, OOP, modules and clean coding.",
        "category": "Programming",
        "difficulty": "intermediate",
        "duration": 25,
        "provider": "PathPilot Academy",
        "skills": ["Python", "Object Oriented Programming"],
    },

    {
        "title": "Data Structures and Algorithms",
        "description": "Learn arrays, stacks, queues, trees, graphs and algorithms.",
        "category": "Programming",
        "difficulty": "intermediate",
        "duration": 35,
        "provider": "PathPilot Academy",
        "skills": ["Python", "Data Structures"],
    },

    {
        "title": "Git and GitHub Fundamentals",
        "description": "Learn Git version control, branching, merging and collaboration.",
        "category": "Tools",
        "difficulty": "beginner",
        "duration": 10,
        "provider": "PathPilot Academy",
        "skills": ["Git"],
    },

    # -------------------------
    # DATA
    # -------------------------

    {
        "title": "SQL for Data Analysis",
        "description": "Learn SQL queries, joins, grouping, aggregation and analysis.",
        "category": "Data",
        "difficulty": "beginner",
        "duration": 18,
        "provider": "PathPilot Academy",
        "skills": ["SQL"],
    },

    {
        "title": "Statistics for Data Science",
        "description": "Learn probability, distributions, hypothesis testing and statistical inference.",
        "category": "Data Science",
        "difficulty": "beginner",
        "duration": 30,
        "provider": "PathPilot Academy",
        "skills": ["Statistics"],
    },

    {
        "title": "Data Analysis with Pandas",
        "description": "Clean, transform and analyze datasets using Pandas.",
        "category": "Data Science",
        "difficulty": "beginner",
        "duration": 20,
        "provider": "PathPilot Academy",
        "skills": ["Python", "Pandas", "Data Analysis"],
    },

    {
        "title": "Numerical Computing with NumPy",
        "description": "Learn numerical computing and array operations using NumPy.",
        "category": "Data Science",
        "difficulty": "beginner",
        "duration": 15,
        "provider": "PathPilot Academy",
        "skills": ["Python", "NumPy"],
    },

    {
        "title": "Practical Data Analysis",
        "description": "Perform exploratory data analysis and extract insights.",
        "category": "Data Science",
        "difficulty": "intermediate",
        "duration": 25,
        "provider": "PathPilot Academy",
        "skills": ["Pandas", "NumPy", "Data Analysis", "Statistics"],
    },

    # -------------------------
    # MACHINE LEARNING
    # -------------------------

    {
        "title": "Machine Learning Fundamentals",
        "description": "Learn supervised and unsupervised machine learning algorithms.",
        "category": "AI/ML",
        "difficulty": "intermediate",
        "duration": 40,
        "provider": "PathPilot Academy",
        "skills": ["Python", "Statistics", "Machine Learning"],
    },

    {
        "title": "Machine Learning with Scikit-learn",
        "description": "Build machine learning models using scikit-learn.",
        "category": "AI/ML",
        "difficulty": "intermediate",
        "duration": 30,
        "provider": "PathPilot Academy",
        "skills": ["Machine Learning", "Scikit-learn", "Model Evaluation"],
    },

    {
        "title": "Feature Engineering for ML",
        "description": "Learn techniques for creating and selecting ML features.",
        "category": "AI/ML",
        "difficulty": "intermediate",
        "duration": 20,
        "provider": "PathPilot Academy",
        "skills": ["Machine Learning", "Feature Engineering"],
    },

    {
        "title": "Machine Learning Model Evaluation",
        "description": "Learn accuracy, precision, recall, F1, ROC-AUC and cross-validation.",
        "category": "AI/ML",
        "difficulty": "intermediate",
        "duration": 18,
        "provider": "PathPilot Academy",
        "skills": ["Machine Learning", "Model Evaluation", "Statistics"],
    },

    {
        "title": "End-to-End ML Project",
        "description": "Build and deploy a complete machine learning project.",
        "category": "AI/ML",
        "difficulty": "advanced",
        "duration": 45,
        "provider": "PathPilot Academy",
        "skills": ["Python", "Machine Learning", "Scikit-learn", "Feature Engineering"],
        "project": True,
    },

    # -------------------------
    # DEEP LEARNING
    # -------------------------

    {
        "title": "Deep Learning Fundamentals",
        "description": "Learn neural networks, backpropagation and optimization.",
        "category": "AI/ML",
        "difficulty": "advanced",
        "duration": 45,
        "provider": "PathPilot Academy",
        "skills": ["Machine Learning", "Deep Learning"],
    },

    {
        "title": "Deep Learning with TensorFlow",
        "description": "Build neural network models using TensorFlow.",
        "category": "AI/ML",
        "difficulty": "advanced",
        "duration": 40,
        "provider": "PathPilot Academy",
        "skills": ["Deep Learning", "TensorFlow"],
    },

    {
        "title": "Deep Learning with PyTorch",
        "description": "Build neural network models using PyTorch.",
        "category": "AI/ML",
        "difficulty": "advanced",
        "duration": 40,
        "provider": "PathPilot Academy",
        "skills": ["Deep Learning", "PyTorch"],
    },

    {
        "title": "Computer Vision Fundamentals",
        "description": "Learn image processing and computer vision techniques.",
        "category": "AI/ML",
        "difficulty": "advanced",
        "duration": 35,
        "provider": "PathPilot Academy",
        "skills": ["Python", "Deep Learning", "Computer Vision"],
    },

    # -------------------------
    # NLP / GEN AI
    # -------------------------

    {
        "title": "Natural Language Processing",
        "description": "Learn text preprocessing, classification and NLP techniques.",
        "category": "AI/ML",
        "difficulty": "advanced",
        "duration": 35,
        "provider": "PathPilot Academy",
        "skills": ["Python", "NLP"],
    },

    {
        "title": "Transformers Architecture",
        "description": "Understand attention and transformer architectures.",
        "category": "Generative AI",
        "difficulty": "advanced",
        "duration": 30,
        "provider": "PathPilot Academy",
        "skills": ["Deep Learning", "NLP", "Transformers"],
    },

    {
        "title": "Generative AI Fundamentals",
        "description": "Understand modern generative AI systems and applications.",
        "category": "Generative AI",
        "difficulty": "intermediate",
        "duration": 25,
        "provider": "PathPilot Academy",
        "skills": ["Python", "Generative AI"],
    },

    {
        "title": "Large Language Models",
        "description": "Understand LLM architecture, training and applications.",
        "category": "Generative AI",
        "difficulty": "advanced",
        "duration": 40,
        "provider": "PathPilot Academy",
        "skills": ["Transformers", "LLMs"],
    },

    {
        "title": "Prompt Engineering",
        "description": "Design effective prompts for generative AI systems.",
        "category": "Generative AI",
        "difficulty": "beginner",
        "duration": 12,
        "provider": "PathPilot Academy",
        "skills": ["Generative AI", "Prompt Engineering"],
    },

    {
        "title": "Retrieval Augmented Generation",
        "description": "Build RAG applications using documents and language models.",
        "category": "Generative AI",
        "difficulty": "advanced",
        "duration": 35,
        "provider": "PathPilot Academy",
        "skills": ["LLMs", "RAG"],
        "project": True,
    },

    # -------------------------
    # BACKEND
    # -------------------------

    {
        "title": "FastAPI Development",
        "description": "Build modern Python APIs using FastAPI.",
        "category": "Backend",
        "difficulty": "intermediate",
        "duration": 25,
        "provider": "PathPilot Academy",
        "skills": ["Python", "FastAPI", "REST APIs"],
    },

    {
        "title": "Flask Web Development",
        "description": "Build Python web applications with Flask.",
        "category": "Backend",
        "difficulty": "intermediate",
        "duration": 25,
        "provider": "PathPilot Academy",
        "skills": ["Python", "Flask", "REST APIs"],
    },

    {
        "title": "REST API Design",
        "description": "Learn REST principles, HTTP methods and API architecture.",
        "category": "Backend",
        "difficulty": "intermediate",
        "duration": 18,
        "provider": "PathPilot Academy",
        "skills": ["REST APIs"],
    },

    # -------------------------
    # WEB
    # -------------------------

    {
        "title": "HTML and CSS Fundamentals",
        "description": "Build web pages using HTML and CSS.",
        "category": "Web Development",
        "difficulty": "beginner",
        "duration": 20,
        "provider": "PathPilot Academy",
        "skills": ["HTML/CSS"],
    },

    {
        "title": "JavaScript Fundamentals",
        "description": "Learn modern JavaScript programming.",
        "category": "Web Development",
        "difficulty": "beginner",
        "duration": 25,
        "provider": "PathPilot Academy",
        "skills": ["JavaScript"],
    },

    {
        "title": "React Development",
        "description": "Build component-based web applications with React.",
        "category": "Web Development",
        "difficulty": "intermediate",
        "duration": 30,
        "provider": "PathPilot Academy",
        "skills": ["JavaScript", "React"],
    },

    {
        "title": "TypeScript Development",
        "description": "Build scalable applications using TypeScript.",
        "category": "Web Development",
        "difficulty": "intermediate",
        "duration": 20,
        "provider": "PathPilot Academy",
        "skills": ["JavaScript", "TypeScript"],
    },

    # -------------------------
    # CLOUD / DEVOPS
    # -------------------------

    {
        "title": "Linux Fundamentals",
        "description": "Learn Linux commands, permissions, processes and networking.",
        "category": "Cloud/DevOps",
        "difficulty": "beginner",
        "duration": 25,
        "provider": "PathPilot Academy",
        "skills": ["Linux"],
    },

    {
        "title": "Docker Fundamentals",
        "description": "Learn containers, images and Docker workflows.",
        "category": "Cloud/DevOps",
        "difficulty": "intermediate",
        "duration": 20,
        "provider": "PathPilot Academy",
        "skills": ["Linux", "Docker"],
    },

    {
        "title": "Kubernetes Fundamentals",
        "description": "Learn container orchestration using Kubernetes.",
        "category": "Cloud/DevOps",
        "difficulty": "advanced",
        "duration": 35,
        "provider": "PathPilot Academy",
        "skills": ["Docker", "Kubernetes"],
    },

    {
        "title": "AWS Cloud Fundamentals",
        "description": "Learn core AWS cloud concepts and services.",
        "category": "Cloud",
        "difficulty": "beginner",
        "duration": 30,
        "provider": "PathPilot Academy",
        "skills": ["AWS"],
    },

    {
        "title": "Azure Cloud Fundamentals",
        "description": "Learn Microsoft Azure cloud concepts.",
        "category": "Cloud",
        "difficulty": "beginner",
        "duration": 30,
        "provider": "PathPilot Academy",
        "skills": ["Azure"],
    },

    {
        "title": "DevOps Fundamentals",
        "description": "Learn CI/CD, automation and DevOps practices.",
        "category": "Cloud/DevOps",
        "difficulty": "intermediate",
        "duration": 30,
        "provider": "PathPilot Academy",
        "skills": ["Linux", "Git", "DevOps"],
    },

    {
        "title": "MLOps Fundamentals",
        "description": "Learn deployment and monitoring of machine learning systems.",
        "category": "AI/ML",
        "difficulty": "advanced",
        "duration": 35,
        "provider": "PathPilot Academy",
        "skills": ["Machine Learning", "Docker", "MLOps"],
        "project": True,
    },

    # -------------------------
    # CYBERSECURITY
    # -------------------------

    {
        "title": "Cybersecurity Fundamentals",
        "description": "Learn core security concepts, threats and defenses.",
        "category": "Security",
        "difficulty": "beginner",
        "duration": 25,
        "provider": "PathPilot Academy",
        "skills": ["Cybersecurity"],
    },

    {
        "title": "Computer Networking Fundamentals",
        "description": "Learn TCP/IP, OSI, routing and network protocols.",
        "category": "Security",
        "difficulty": "beginner",
        "duration": 30,
        "provider": "PathPilot Academy",
        "skills": ["Networking"],
    },

    {
        "title": "Network Security",
        "description": "Learn firewalls, attacks, monitoring and network defense.",
        "category": "Security",
        "difficulty": "intermediate",
        "duration": 30,
        "provider": "PathPilot Academy",
        "skills": ["Networking", "Network Security"],
    },

    {
        "title": "SIEM Fundamentals",
        "description": "Learn security event collection, correlation and monitoring.",
        "category": "Security",
        "difficulty": "intermediate",
        "duration": 25,
        "provider": "PathPilot Academy",
        "skills": ["Cybersecurity", "SIEM"],
    },

    {
        "title": "Splunk for Security Monitoring",
        "description": "Analyze security logs using Splunk.",
        "category": "Security",
        "difficulty": "intermediate",
        "duration": 25,
        "provider": "PathPilot Academy",
        "skills": ["SIEM", "Splunk"],
    },

    {
        "title": "Cloud Security Fundamentals",
        "description": "Learn identity, access and security controls in cloud environments.",
        "category": "Security",
        "difficulty": "advanced",
        "duration": 30,
        "provider": "PathPilot Academy",
        "skills": ["AWS", "Azure", "Cloud Security"],
    },

    {
        "title": "SOC Analyst Project",
        "description": "Build a practical security monitoring workflow.",
        "category": "Security",
        "difficulty": "advanced",
        "duration": 40,
        "provider": "PathPilot Academy",
        "skills": ["Cybersecurity", "SIEM", "Splunk"],
        "project": True,
    },
]

PREREQUISITES = [
    ("NumPy", "Python"),
    ("Pandas", "Python"),
    ("Data Analysis", "Python"),

    ("Machine Learning", "Python"),
    ("Machine Learning", "Statistics"),
    ("Scikit-learn", "Machine Learning"),
    ("Feature Engineering", "Machine Learning"),
    ("Model Evaluation", "Machine Learning"),

    ("Deep Learning", "Machine Learning"),
    ("TensorFlow", "Deep Learning"),
    ("PyTorch", "Deep Learning"),
    ("Computer Vision", "Deep Learning"),

    ("NLP", "Python"),
    ("Transformers", "Deep Learning"),
    ("Transformers", "NLP"),

    ("Generative AI", "Machine Learning"),
    ("LLMs", "Transformers"),
    ("Prompt Engineering", "Generative AI"),
    ("RAG", "LLMs"),

    ("FastAPI", "Python"),
    ("Flask", "Python"),
    ("REST APIs", "Python"),

    ("React", "JavaScript"),
    ("TypeScript", "JavaScript"),

    ("Docker", "Linux"),
    ("Kubernetes", "Docker"),
    ("DevOps", "Git"),
    ("DevOps", "Linux"),
    ("MLOps", "Machine Learning"),
    ("MLOps", "Docker"),

    ("Network Security", "Networking"),
    ("SIEM", "Cybersecurity"),
    ("SIEM", "Networking"),
    ("Splunk", "SIEM"),
    ("Cloud Security", "AWS"),
    ("Cloud Security", "Azure"),
]


def seed_database():
    db: Session = SessionLocal()

    try:
        print("Starting PathPilot database seeding...")

        # -------------------------
        # Skills
        # -------------------------

        skill_map = {}

        for name, category, description in SKILLS:
            skill = db.query(Skill).filter(
                Skill.name == name
            ).first()

            if not skill:
                skill = Skill(
                    name=name,
                    category=category,
                    description=description,
                )

                db.add(skill)
                db.flush()

            skill_map[name] = skill

        print(f"[OK] Skills loaded: {len(skill_map)}")

        # -------------------------
        # Prerequisites
        # -------------------------

        prerequisite_count = 0

        for skill_name, prerequisite_name in PREREQUISITES:

            skill = skill_map[skill_name]
            prerequisite = skill_map[prerequisite_name]

            exists = db.query(Prerequisite).filter(
                Prerequisite.skill_id == skill.id,
                Prerequisite.prerequisite_skill_id == prerequisite.id,
            ).first()

            if not exists:
                db.add(
                    Prerequisite(
                        skill_id=skill.id,
                        prerequisite_skill_id=prerequisite.id,
                        strength=1.0,
                    )
                )

                prerequisite_count += 1

        print(
            f"[OK] Prerequisites loaded: {prerequisite_count}"
        )

        # -------------------------
        # Courses
        # -------------------------

        course_count = 0
        course_map = {}

        for course_data in COURSES:

            course = db.query(Course).filter(
                Course.title == course_data["title"]
            ).first()

            if not course:
                course = Course(
                    title=course_data["title"],
                    description=course_data["description"],
                    category=course_data["category"],
                    difficulty=course_data["difficulty"],
                    duration_hours=course_data["duration"],
                    provider=course_data["provider"],
                    url=None,
                    is_project=course_data.get(
                        "project",
                        False
                    ),
                )

                db.add(course)
                db.flush()

                course_count += 1

            course_map[course.title] = course

            # -------------------------
            # Course → Skill
            # -------------------------

            for skill_name in course_data["skills"]:

                skill = skill_map[skill_name]

                exists = db.query(CourseSkill).filter(
                    CourseSkill.course_id == course.id,
                    CourseSkill.skill_id == skill.id,
                ).first()

                if not exists:
                    db.add(
                        CourseSkill(
                            course_id=course.id,
                            skill_id=skill.id,
                            importance=1.0,
                        )
                    )

        print(f"[OK] Courses loaded: {len(course_map)}")

        # -------------------------
        # Demo Learner
        # -------------------------

        demo_user = db.query(User).filter(
            User.email == "demo@pathpilot.ai"
        ).first()

        if not demo_user:

            demo_user = User(
                email="demo@pathpilot.ai",
                password_hash=hash_password("demo_password"),
                full_name="Demo Learner",
            )

            db.add(demo_user)
            db.flush()

        profile = db.query(
            LearnerProfile
        ).filter(
            LearnerProfile.user_id == demo_user.id
        ).first()

        if not profile:

            profile = LearnerProfile(
                user_id=demo_user.id,
                target_role="AI Engineer",
                experience_level="beginner",
                education="B.Tech Computer Science",
                interests="AI, Machine Learning, Generative AI",
                preferences="Project-based learning",
                weekly_hours=10,
            )

            db.add(profile)

        # -------------------------
        # Demo Learner Skills
        # -------------------------

        demo_skills = {
            "Python": 80,
            "SQL": 70,
            "Statistics": 30,
            "Machine Learning": 30,
            "Git": 60,
        }

        for skill_name, proficiency in demo_skills.items():

            skill = skill_map[skill_name]

            learner_skill = db.query(
                LearnerSkill
            ).filter(
                LearnerSkill.user_id == demo_user.id,
                LearnerSkill.skill_id == skill.id,
            ).first()

            if not learner_skill:

                learner_skill = LearnerSkill(
                    user_id=demo_user.id,
                    skill_id=skill.id,
                    proficiency=proficiency,
                    confidence=proficiency,
                )

                db.add(learner_skill)

        db.commit()

        print("\n================================")
        print("PathPilot seeding completed!")
        print("================================")
        print(f"Skills: {len(skill_map)}")
        print(f"Courses: {len(course_map)}")
        print(f"Prerequisites: {prerequisite_count}")
        print(f"Demo user: {demo_user.email}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
