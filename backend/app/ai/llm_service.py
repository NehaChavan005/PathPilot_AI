import json
import logging
import os
import re
from typing import Any
import httpx

logger = logging.getLogger(__name__)


class LLMService:
    """Universal LLM client supporting Google Gemini, OpenAI, and a built-in intelligent offline engine.
    
    Ensures the application never crashes even without API keys or internet access.
    """

    def __init__(self) -> None:
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "").strip()
        self.gemini_model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        self.openai_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    @property
    def provider(self) -> str:
        if self.gemini_api_key:
            return "gemini"
        if self.openai_api_key:
            return "openai"
        return "offline_engine"

    def generate(self, prompt: str, system_prompt: str | None = None, temperature: float = 0.7) -> str:
        """Generate a response using the configured provider, falling back safely to the offline engine."""
        if self.gemini_api_key:
            try:
                return self._call_gemini(prompt, system_prompt, temperature)
            except Exception as e:
                logger.warning(f"Gemini API call failed ({e}), using intelligent offline fallback.")

        if self.openai_api_key:
            try:
                return self._call_openai(prompt, system_prompt, temperature)
            except Exception as e:
                logger.warning(f"OpenAI API call failed ({e}), using intelligent offline fallback.")

        return self._offline_generate(prompt, system_prompt)

    def generate_json(self, prompt: str, system_prompt: str | None = None) -> dict[str, Any]:
        """Generate structured JSON response with automatic markdown fencing cleanup."""
        full_prompt = f"{prompt}\n\nRespond ONLY with valid JSON. Do not include markdown code block formatting or explanation."
        raw_text = self.generate(full_prompt, system_prompt=system_prompt, temperature=0.2)

        # Clean markdown codeblocks like ```json ... ```
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned.strip())

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Attempt regex extraction of JSON object or array
            match = re.search(r"(\{.*\}|\[.*\])", cleaned, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1))
                except json.JSONDecodeError:
                    pass
            logger.warning(f"Failed to parse LLM response as JSON: {raw_text[:120]}")
            return {"raw_response": raw_text}

    def _call_gemini(self, prompt: str, system_prompt: str | None = None, temperature: float = 0.7) -> str:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.gemini_model}:generateContent?key={self.gemini_api_key}"
        contents: list[dict[str, Any]] = []

        if system_prompt:
            contents.append({"role": "user", "parts": [{"text": f"Instructions: {system_prompt}"}]})
            contents.append({"role": "model", "parts": [{"text": "Understood. I will follow these instructions."}]})

        contents.append({"role": "user", "parts": [{"text": prompt}]})

        payload = {
            "contents": contents,
            "generationConfig": {"temperature": temperature, "maxOutputTokens": 2048},
        }

        with httpx.Client(timeout=20.0) as client:
            resp = client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]

    def _call_openai(self, prompt: str, system_prompt: str | None = None, temperature: float = 0.7) -> str:
        url = "https://api.openai.com/v1/chat/completions"
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        headers = {
            "Authorization": f"Bearer {self.openai_api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.openai_model,
            "messages": messages,
            "temperature": temperature,
        }

        with httpx.Client(timeout=20.0) as client:
            resp = client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    def _offline_generate(self, prompt: str, system_prompt: str | None = None) -> str:
        """Intelligent offline pedagogical response generator when no external API key is configured."""
        prompt_lower = prompt.lower()

        # Domain query handling
        if "roadmap" in prompt_lower or "learning path" in prompt_lower:
            return (
                "To structure your learning journey effectively, start by strengthening foundational concepts "
                "before moving to applied frameworks. Break your study schedule into weekly milestones: "
                "dedicate 60% of your time to hands-on projects and 40% to theory."
            )
        if "python" in prompt_lower:
            return (
                "Python is central to modern backend engineering and data science. Focus on mastering "
                "data structures (lists, dicts, sets), list comprehensions, generators, and object-oriented design. "
                "Practice writing clean, PEP 8 compliant code."
            )
        if "sql" in prompt_lower or "database" in prompt_lower:
            return (
                "Database design and SQL queries are foundational. Master indexing, JOIN operations, "
                "subqueries, window functions, and normalization (3NF) to ensure efficient data retrieval."
            )
        if "machine learning" in prompt_lower or "ai" in prompt_lower:
            return (
                "In Machine Learning, build a firm grasp on linear algebra, statistics, and loss functions. "
                "Progress from Scikit-Learn (regression, classification, clustering) to PyTorch deep neural networks, "
                "evaluating models with precision, recall, and ROC-AUC."
            )
        if "docker" in prompt_lower or "devops" in prompt_lower:
            return (
                "Containerization with Docker isolates applications and dependencies. Focus on writing multi-stage "
                "Dockerfiles, container networking, volume mounting, and orchestrating services with Docker Compose."
            )

        return (
            f"Here is a targeted recommendation for your goal: {prompt.strip()}. "
            "Focus on active learning through hands-on code implementations, verifying each concept with "
            "diagnostic assessments, and bridging prerequisite skill gaps sequentially."
        )
