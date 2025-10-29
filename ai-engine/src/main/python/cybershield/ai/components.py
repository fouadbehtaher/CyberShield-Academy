from __future__ import annotations

import math
from statistics import mean
from typing import Any, Dict, Iterable, List, Mapping

from .models import LearningSession


class HybridRecommendationEngine:
    """Blend content-based and collaborative filtering signals."""

    def generate(self, session: LearningSession, knowledge_state: Mapping[str, float]) -> List[Dict[str, Any]]:
        coverage = knowledge_state.get("coverage", 0.0)
        difficulty = knowledge_state.get("recommended_difficulty", 0.5)
        score = max(0.1, min(1.0, 1 - coverage * difficulty))
        return [
            {
                "module_id": f"adaptive-path-{i}",
                "relevance": round(score - i * 0.1, 3),
                "difficulty": difficulty + i * 0.05,
            }
            for i in range(3)
        ]


class LearningStyleDetector:
    """Rudimentary heuristic for identifying learning preferences."""

    def detect(self, session: LearningSession) -> Dict[str, Any]:
        interaction_types = [interaction.get("type", "unknown") for interaction in session.interactions]
        visual_ratio = interaction_types.count("visual") / max(len(interaction_types), 1)
        kinesthetic_ratio = interaction_types.count("hands-on") / max(len(interaction_types), 1)
        dominant = max(("visual", visual_ratio), ("kinesthetic", kinesthetic_ratio), key=lambda x: x[1])[0]
        return {"style": dominant, "confidence": round(max(visual_ratio, kinesthetic_ratio), 3)}


class EngagementPredictor:
    """Score session engagement using simple aggregates."""

    def predict(self, session: LearningSession) -> Dict[str, float]:
        durations = [float(interaction.get("duration", 0.0)) for interaction in session.interactions]
        avg_duration = mean(durations) if durations else 0.0
        activity_bonus = sum(1 for item in session.interactions if item.get("completed")) * 0.05
        score = min(1.0, avg_duration * 0.01 + activity_bonus)
        return {"engagement_score": round(score, 3)}


class CognitiveLoadEstimator:
    """Estimate cognitive load based on interaction complexity."""

    def estimate(self, session: LearningSession) -> Dict[str, float]:
        complexities = [float(interaction.get("complexity", 0.5)) for interaction in session.interactions]
        avg_complexity = mean(complexities) if complexities else 0.5
        pace = float(session.metadata.get("pace", 1.0))
        load = min(1.0, math.sqrt(avg_complexity * pace))
        return {"cognitive_load": round(load, 3)}


class AdaptiveInterventionEngine:
    """Translate predictions into actionable interventions."""

    def generate_interventions(
        self,
        aggregated_predictions: Mapping[str, Any],
        user_context: Mapping[str, Any],
    ) -> List[Dict[str, Any]]:
        engagement = aggregated_predictions.get("engagement_score", 0.5)
        cognitive_load = aggregated_predictions.get("cognitive_load", 0.5)
        priority = "high" if engagement < 0.3 or cognitive_load > 0.8 else "normal"
        return [
            {
                "type": "content_adjustment",
                "priority": priority,
                "message": "Adjusting content difficulty based on current engagement and load levels.",
            }
        ]
