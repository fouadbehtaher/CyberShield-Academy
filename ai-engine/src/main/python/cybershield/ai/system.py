from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, Mapping

from .components import (
    AdaptiveInterventionEngine,
    CognitiveLoadEstimator,
    EngagementPredictor,
    HybridRecommendationEngine,
    LearningStyleDetector,
)
from .knowledge_tracing import DeepKnowledgeTracingModel
from .models import AIPrediction, LearningSession

LOGGER = logging.getLogger(__name__)


class CyberShieldAISystem:
    """Coordinate multi-model pipelines for advanced learning analytics."""

    def __init__(self) -> None:
        self.recommendation_engine = HybridRecommendationEngine()
        self.learning_style_detector = LearningStyleDetector()
        self.knowledge_tracing_model = DeepKnowledgeTracingModel()
        self.engagement_predictor = EngagementPredictor()
        self.intervention_engine = AdaptiveInterventionEngine()
        self.cognitive_load_estimator = CognitiveLoadEstimator()

    async def process_learning_session(self, session_data: LearningSession) -> AIPrediction:
        tasks = {
            "learning_style": self.analyze_learning_style(session_data),
            "knowledge_state": self.trace_knowledge_state(session_data),
            "engagement": self.predict_engagement(session_data),
            "cognitive_load": self.detect_cognitive_load(session_data),
        }

        raw_results = await asyncio.gather(*tasks.values(), return_exceptions=True)
        result_map: Dict[str, Any] = {}

        for key, value in zip(tasks.keys(), raw_results):
            if isinstance(value, Exception):
                LOGGER.exception("AI pipeline component failed: %s", key, exc_info=value)
                continue
            result_map[key] = value

        knowledge_state = result_map.get("knowledge_state", {})
        recommendations = await asyncio.to_thread(self.recommendation_engine.generate, session_data, knowledge_state)

        integrated_prediction = self.ensemble_predictions(result_map, recommendations)
        interventions = self.intervention_engine.generate_interventions(
            integrated_prediction,
            session_data.user_context,
        )

        return AIPrediction(
            predictions=integrated_prediction,
            interventions=interventions,
            confidence_scores=self.calculate_confidence(result_map),
        )

    async def analyze_learning_style(self, session_data: LearningSession) -> Mapping[str, Any]:
        return await asyncio.to_thread(self.learning_style_detector.detect, session_data)

    async def trace_knowledge_state(self, session_data: LearningSession) -> Mapping[str, Any]:
        return await asyncio.to_thread(self.knowledge_tracing_model.trace_knowledge_state, session_data)

    async def predict_engagement(self, session_data: LearningSession) -> Mapping[str, float]:
        return await asyncio.to_thread(self.engagement_predictor.predict, session_data)

    async def detect_cognitive_load(self, session_data: LearningSession) -> Mapping[str, float]:
        return await asyncio.to_thread(self.cognitive_load_estimator.estimate, session_data)

    def ensemble_predictions(
        self,
        component_outputs: Mapping[str, Any],
        recommendations: Any,
    ) -> Dict[str, Any]:
        aggregated: Dict[str, Any] = {}
        knowledge_state = component_outputs.get("knowledge_state", {})
        engagement = component_outputs.get("engagement", {})
        cognitive_load = component_outputs.get("cognitive_load", {})

        aggregated.update(knowledge_state)
        aggregated.update(engagement)
        aggregated.update(cognitive_load)
        aggregated["learning_style"] = component_outputs.get("learning_style", {})
        aggregated["recommendations"] = recommendations
        return aggregated

    def calculate_confidence(self, component_outputs: Mapping[str, Any]) -> Dict[str, float]:
        confidence: Dict[str, float] = {}
        for key, value in component_outputs.items():
            if isinstance(value, Mapping) and "confidence" in value:
                confidence[key] = float(value["confidence"])
            else:
                confidence[key] = 0.6
        return confidence
