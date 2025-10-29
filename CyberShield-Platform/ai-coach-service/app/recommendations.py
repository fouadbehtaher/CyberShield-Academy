from __future__ import annotations

import json
from typing import Any, Dict, Iterable, List


class RecommendationEngine:
    def __init__(self) -> None:
        self.catalog = self._load_content_catalog()

    def _load_content_catalog(self) -> List[Dict[str, Any]]:
        return [
            {
                "content_id": "mod-network-basics",
                "tag": "network",
                "level": 1,
                "description": "Network security fundamentals",
            },
            {
                "content_id": "mod-appsec-advanced",
                "tag": "application",
                "level": 2,
                "description": "Advanced application security labs",
            },
            {
                "content_id": "mod-incident-response",
                "tag": "incident-response",
                "level": 3,
                "description": "Incident response playbooks",
            },
        ]

    def generate_recommendations(
        self,
        user_profile: Dict[str, Any] | None,
        user_behaviors: Iterable[Dict[str, Any]] | None,
    ) -> List[Dict[str, Any]]:
        if not user_profile:
            return []

        skills = self._safe_load_mapping(user_profile.get("skills"))
        completed_modules = set(self._safe_load_sequence(user_profile.get("completed_modules")))
        behavior_focus = self._infer_behavior_focus(user_behaviors or [])

        recommendations: List[Dict[str, Any]] = []

        for entry in self.catalog:
            if entry["content_id"] in completed_modules:
                continue

            competency_gap = 1.0 - min(1.0, skills.get(entry["tag"], 0) / 10.0)
            behavior_bonus = behavior_focus.get(entry["tag"], 0.0)
            confidence = round(0.5 * competency_gap + 0.5 * behavior_bonus, 2)

            reasoning_parts = []
            if competency_gap > 0.4:
                reasoning_parts.append("Skill gap detected")
            if behavior_bonus > 0.2:
                reasoning_parts.append("Recent activity correlates with this topic")
            if not reasoning_parts:
                reasoning_parts.append("Recommended to reinforce learning path")

            recommendations.append(
                {
                    "content_id": entry["content_id"],
                    "confidence": confidence,
                    "reasoning": "; ".join(reasoning_parts),
                    "estimated_completion_time": entry.get("estimated_time", 45),
                    "priority": "high" if confidence >= 0.7 else "medium",
                }
            )

        return sorted(recommendations, key=lambda item: item["confidence"], reverse=True)[:10]

    def _safe_load_mapping(self, value: Any) -> Dict[str, float]:
        if isinstance(value, dict):
            return {str(key): float(val) for key, val in value.items()}
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, dict):
                    return {str(key): float(val) for key, val in parsed.items()}
            except json.JSONDecodeError:
                return {}
        return {}

    def _safe_load_sequence(self, value: Any) -> List[str]:
        if isinstance(value, list):
            return [str(item) for item in value]
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return [str(item) for item in parsed]
            except json.JSONDecodeError:
                return []
        return []

    def _infer_behavior_focus(self, behaviors: Iterable[Dict[str, Any]]) -> Dict[str, float]:
        focus: Dict[str, float] = {}
        total_events = 0

        for event in behaviors:
            metadata = event.get("metadata")
            if isinstance(metadata, str):
                try:
                    metadata = json.loads(metadata)
                except json.JSONDecodeError:
                    metadata = None

            tag = None
            if isinstance(metadata, dict):
                tag = metadata.get("topic") or metadata.get("skill")
            if not tag and isinstance(event.get("event_type"), str):
                parts = event["event_type"].split(":")
                if len(parts) > 1:
                    tag = parts[1]

            if tag:
                tag_str = str(tag)
                focus[tag_str] = focus.get(tag_str, 0.0) + 1.0
                total_events += 1

        if total_events == 0:
            return {}

        return {tag: round(count / total_events, 2) for tag, count in focus.items()}
