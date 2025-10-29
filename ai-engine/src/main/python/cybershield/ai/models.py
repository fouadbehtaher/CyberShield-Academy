from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, Iterable, List, Mapping, Sequence


@dataclass(slots=True)
class LearningSession:
    """Container for the signals gathered during a learner's session."""

    user_id: str
    interactions: Sequence[Mapping[str, Any]]
    user_context: Mapping[str, Any]
    learning_objectives: Sequence[str] = field(default_factory=tuple)
    metadata: Mapping[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.utcnow)

    def feature_vector(self) -> List[float]:
        """Provide a basic numerical representation for downstream models."""
        base_features = [float(len(self.interactions)), float(len(self.learning_objectives))]
        context_factor = float(self.user_context.get("proficiency_level", 0.5))
        return [*base_features, context_factor]


@dataclass(slots=True)
class AIPrediction:
    """Aggregated AI decisioning output for a learning session."""

    predictions: Mapping[str, Any]
    interventions: Iterable[Mapping[str, Any]]
    confidence_scores: Mapping[str, float]
    generated_at: datetime = field(default_factory=datetime.utcnow)

    def top_intervention(self) -> Mapping[str, Any] | None:
        interventions = list(self.interventions)
        return interventions[0] if interventions else None
