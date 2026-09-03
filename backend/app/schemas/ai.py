from typing import Any
from pydantic import BaseModel, Field


# Feature 1: Goal Analysis Schemas
class GoalAnalysisRequest(BaseModel):
    goal: str = Field(..., min_length=2, max_length=1000, description="Career or learning goal description")


class GoalAnalysisResponse(BaseModel):
    original_goal: str
    target_role: str
    difficulty_level: str
    estimated_duration_weeks: int
    core_skills: list[str]
    recommended_skills: list[str]
    explicitly_mentioned_skills: list[str]
    suggested_learning_direction: str
    coaching_tip: str


# Feature 2: Skill Assessment & Gap Schemas
class SkillGapItem(BaseModel):
    skill: str
    priority: str
    reason: str
    prerequisites_needed: list[str] = []
    difficulty: str = "Intermediate"


class SkillGapRequest(BaseModel):
    target_role: str | None = None
    current_skills: list[str] = []
    target_skills: list[str] | None = None


class SkillGapResponse(BaseModel):
    target_role: str
    current_skills: list[str]
    matching_skills: list[str]
    total_required: int
    readiness_score: float
    gaps_count: int
    skill_gaps: list[SkillGapItem]


# Feature 4 & 5: Recommendation & XAI Schemas
class RecommendationGenerateRequest(BaseModel):
    goal: str | None = None
    target_role: str | None = None
    current_skills: list[str] | None = None
    top_k: int = Field(10, ge=1, le=50)


class XAIScoreBreakdown(BaseModel):
    skill_match: float
    semantic_content: float
    collaborative_popularity: float
    prerequisite_relevance: float


class DetailedRecommendationRead(BaseModel):
    id: int
    title: str
    provider: str | None = None
    url: str | None = None
    description: str | None = None
    score: float
    reason: str
    key_factors: list[str] = []
    score_breakdown: XAIScoreBreakdown
    covered_skills: list[str] = []


# Feature 6: Personalized Roadmap Schemas
class RoadmapGenerateRequest(BaseModel):
    target_role: str | None = None
    current_skills: list[str] | None = None
    weekly_study_hours: int = Field(10, ge=2, le=60)


class RoadmapMilestoneRead(BaseModel):
    milestone_number: int
    title: str
    level: str
    target_skills: list[str]
    estimated_hours: int
    estimated_weeks: int
    status: str
    recommended_courses: list[dict[str, Any]] = []


class DetailedRoadmapResponse(BaseModel):
    id: int | None = None
    title: str
    target_role: str
    weekly_study_hours: int
    estimated_total_hours: int
    estimated_total_weeks: int
    readiness_score: float
    milestones: list[RoadmapMilestoneRead]
    steps: list[str]


# Feature 7: AI Assessment Schemas
class AssessmentGenerateRequest(BaseModel):
    topic: str
    difficulty: str = "Intermediate"
    num_questions: int = Field(3, ge=1, le=10)


class QuestionOptionRead(BaseModel):
    id: str
    question: str
    options: list[str]
    subtopic: str


class AssessmentGenerateResponse(BaseModel):
    assessment_id: str
    topic: str
    difficulty: str
    total_questions: int
    questions: list[QuestionOptionRead]


class AssessmentEvaluateRequest(BaseModel):
    assessment_id: str
    answers: dict[str, str]  # question_id -> selected_option_text


class QuestionFeedbackItem(BaseModel):
    question_id: str
    question: str
    your_answer: str
    correct_answer: str
    is_correct: bool
    explanation: str


class AssessmentEvaluationResponse(BaseModel):
    assessment_id: str
    topic: str
    score: float
    total_questions: int
    correct_answers: int
    passed: bool
    weak_skills: list[str]
    diagnosis: str
    detailed_feedback: list[QuestionFeedbackItem]


# Feature 8: Context-Aware Chat
class ChatContextRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)


class ChatResponse(BaseModel):
    reply: str


# Feature 9: Adaptive Learning Schemas
class AdaptiveRecalibrateRequest(BaseModel):
    topic: str
    assessment_score: float = Field(..., ge=0, le=100)
    target_role: str | None = None


class AdaptiveRecalibrateResponse(BaseModel):
    action: str
    topic: str
    score: float
    performance_tier: str
    remedial_skills: list[str]
    unlocked_skills: list[str]
    guidance: str
    recommended_adaptive_courses: list[dict[str, Any]]


# Feature 10: What-If Simulation Schemas
class WhatIfSimulationRequest(BaseModel):
    simulated_role: str | None = None
    current_role: str | None = None
    simulated_weekly_hours: int | None = Field(None, ge=1, le=80)
    current_weekly_hours: int = Field(10, ge=1, le=80)
    current_skills: list[str] = []


class WhatIfSimulationResponse(BaseModel):
    is_simulation: bool = True
    database_mutated: bool = False
    current_role: str
    simulated_role: str
    current_weekly_hours: int
    simulated_weekly_hours: int
    transferable_skills: list[str]
    new_required_skills: list[str]
    unnecessary_skills: list[str]
    readiness_current: float
    readiness_simulated: float
    readiness_delta: float
    estimated_additional_hours: int
    estimated_weeks_at_current_pace: int
    estimated_weeks_at_simulated_pace: int
    weeks_saved: int
    recommended_new_courses: list[str]
    summary: str
