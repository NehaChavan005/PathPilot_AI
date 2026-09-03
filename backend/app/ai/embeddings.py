import logging
import math
import os
import re
from typing import Sequence
import httpx

logger = logging.getLogger(__name__)

# In-memory vector cache for performance
_EMBEDDING_CACHE: dict[str, list[float]] = {}

# Semantic Domain Clusters for concept generalization
DOMAIN_CLUSTERS: dict[str, set[str]] = {
    "AI_ML": {
        "python", "machine learning", "deep learning", "neural network", "data science",
        "statistics", "pandas", "numpy", "scikit-learn", "pytorch", "tensorflow",
        "nlp", "computer vision", "mlops", "generative ai", "llm", "vector database"
    },
    "WEB_DEV": {
        "javascript", "typescript", "html", "css", "react", "node", "fastapi", "django",
        "frontend", "backend", "full stack", "api", "rest", "tailwind", "redux", "next.js"
    },
    "DEVOPS_CLOUD": {
        "docker", "kubernetes", "devops", "ci/cd", "git", "linux", "cloud", "aws", "azure",
        "terraform", "infrastructure", "networking", "security", "sysadmin"
    },
    "DATA_ENGINEERING": {
        "sql", "database", "data engineering", "big data", "spark", "kafka", "pipeline",
        "etl", "data warehouse", "postgresql", "redis"
    },
    "COMPUTER_SCIENCE": {
        "algorithms", "data structures", "system design", "microservices", "testing",
        "programming", "software engineering", "object-oriented"
    },
}


def tokenize_embedding(text: str) -> set[str]:
    """Preserved for backward compatibility: lightweight word tokenization."""
    return {word.lower().strip(".,!?();:'\"") for word in text.split() if word}


def cosine_similarity(v1: Sequence[float], v2: Sequence[float]) -> float:
    """Compute cosine similarity between two numerical vectors."""
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0

    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_a = math.sqrt(sum(a * a for a in v1))
    norm_b = math.sqrt(sum(b * b for b in v2))

    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return float(dot_product / (norm_a * norm_b))


class SemanticEmbeddingEngine:
    """Production-grade semantic embedding engine with provider support and domain cluster projection."""

    def __init__(self) -> None:
        self.provider = os.getenv("EMBEDDING_PROVIDER", "auto").lower()
        self.gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.openai_key = os.getenv("OPENAI_API_KEY", "").strip()

        # Vocabulary of domain concepts for high-dimensional semantic feature projection
        self._concept_features: list[str] = [
            "python", "javascript", "typescript", "html", "css", "sql", "nosql", "database",
            "react", "angular", "vue", "node", "fastapi", "django", "flask", "api", "rest",
            "machine learning", "deep learning", "neural network", "data science", "statistics",
            "pandas", "numpy", "scikit-learn", "pytorch", "tensorflow", "nlp", "computer vision",
            "docker", "kubernetes", "devops", "ci/cd", "git", "linux", "cloud", "aws", "azure",
            "data engineering", "big data", "spark", "kafka", "pipeline", "etl", "warehouse",
            "security", "cryptography", "networking", "testing", "algorithms", "data structures",
            "system design", "microservices", "architecture", "frontend", "backend", "full stack",
            "mlops", "generative ai", "llm", "vector database", "prompt engineering", "terraform"
        ]

    def get_embedding(self, text: str) -> list[float]:
        """Generate a dense semantic vector representation for the given text."""
        cache_key = text.strip().lower()
        if cache_key in _EMBEDDING_CACHE:
            return _EMBEDDING_CACHE[cache_key]

        # External API providers if configured
        if (self.provider == "gemini" or (self.provider == "auto" and self.gemini_key)) and self.gemini_key:
            try:
                vec = self._embed_gemini(text)
                _EMBEDDING_CACHE[cache_key] = vec
                return vec
            except Exception as e:
                logger.warning(f"Gemini embedding failed ({e}), falling back to local engine.")

        if (self.provider == "openai" or (self.provider == "auto" and self.openai_key)) and self.openai_key:
            try:
                vec = self._embed_openai(text)
                _EMBEDDING_CACHE[cache_key] = vec
                return vec
            except Exception as e:
                logger.warning(f"OpenAI embedding failed ({e}), falling back to local engine.")

        # Local deterministic semantic feature projection
        vec = self._embed_local(text)
        _EMBEDDING_CACHE[cache_key] = vec
        return vec

    def _embed_gemini(self, text: str) -> list[float]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={self.gemini_key}"
        payload = {
            "model": "models/text-embedding-004",
            "content": {"parts": [{"text": text[:2048]}]},
        }
        with httpx.Client(timeout=10.0) as client:
            resp = client.post(url, json=payload)
            resp.raise_for_status()
            return resp.json()["embedding"]["values"]

    def _embed_openai(self, text: str) -> list[float]:
        url = "https://api.openai.com/v1/embeddings"
        headers = {"Authorization": f"Bearer {self.openai_key}"}
        payload = {"input": text[:2048], "model": "text-embedding-3-small"}
        with httpx.Client(timeout=10.0) as client:
            resp = client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            return resp.json()["data"][0]["embedding"]

    def _embed_local(self, text: str) -> list[float]:
        """Generate normalized semantic projection vector with concept matching and domain cluster resonance."""
        text_lower = text.lower()
        concept_vec = [0.0] * len(self._concept_features)
        words = set(re.findall(r"\b[a-z0-9+#.-]+\b", text_lower))

        # 1. Direct concept activations
        for idx, concept in enumerate(self._concept_features):
            if " " in concept:
                if concept in text_lower:
                    concept_vec[idx] += 3.0
            else:
                if concept in words:
                    concept_vec[idx] += 2.0
                elif concept in text_lower:
                    concept_vec[idx] += 1.0

        # 2. Domain Cluster Resonance: Concepts in the same domain activate a shared cluster channel
        cluster_vec = [0.0] * len(DOMAIN_CLUSTERS)
        for c_idx, (cluster_name, cluster_terms) in enumerate(DOMAIN_CLUSTERS.items()):
            for term in cluster_terms:
                if " " in term:
                    if term in text_lower:
                        cluster_vec[c_idx] += 2.5
                elif term in words:
                    cluster_vec[c_idx] += 2.0

        # Combine concept specific features + domain cluster features
        combined = concept_vec + cluster_vec
        norm = math.sqrt(sum(x * x for x in combined))
        if norm > 0.0:
            return [x / norm for x in combined]

        # Uniform tiny vector for completely out-of-domain words
        return [0.01] * len(combined)


_default_engine = SemanticEmbeddingEngine()


def get_embedding(text: str) -> list[float]:
    """Global helper to retrieve semantic embedding."""
    return _default_engine.get_embedding(text)


def semantic_similarity(text1: str, text2: str) -> float:
    """Compute semantic similarity score (0.0 to 1.0) between two text strings."""
    v1 = get_embedding(text1)
    v2 = get_embedding(text2)
    sim = cosine_similarity(v1, v2)
    return round(max(0.0, min(1.0, sim)), 3)
