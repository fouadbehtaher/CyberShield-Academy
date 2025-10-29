from __future__ import annotations

from typing import Dict, Iterable, Mapping


class SkillGraph:
    """Lightweight skill dependency graph for knowledge tracing."""

    def __init__(self) -> None:
        self._skill_mastery: Dict[str, float] = {}

    def update_mastery(self, skill_scores: Mapping[str, float]) -> None:
        for skill, score in skill_scores.items():
            self._skill_mastery[skill] = max(self._skill_mastery.get(skill, 0.0), float(score))

    def export_state(self) -> Mapping[str, float]:
        return dict(self._skill_mastery)

    def relevant_skills(self, skills: Iterable[str]) -> Mapping[str, float]:
        return {skill: self._skill_mastery.get(skill, 0.0) for skill in skills}
