from __future__ import annotations

import logging
from typing import Any, Dict, Mapping

import numpy as np

from .models import LearningSession
from .skill_graph import SkillGraph

try:
    import tensorflow as tf  # type: ignore
except ImportError:  # pragma: no cover - runtime guard
    tf = None  # type: ignore


LOGGER = logging.getLogger(__name__)


class DeepKnowledgeTracingModel:
    """Deep Knowledge Tracing model with optional attention mechanism."""

    def __init__(self, num_skills: int = 200, hidden_units: int = 100) -> None:
        self.num_skills = num_skills
        self.hidden_units = hidden_units
        self.skill_graph = SkillGraph()
        self.model = self.load_pretrained_model()

    def load_pretrained_model(self):
        """Load the Keras model, providing a lightweight fallback when TF is absent."""

        if tf is None:  # pragma: no cover - environment safeguard
            LOGGER.warning("TensorFlow not available, using deterministic stub for DKT predictions.")

            class DKTStub:
                def predict(self, inputs: np.ndarray, verbose: int = 0) -> np.ndarray:
                    batch, sequence, _ = inputs.shape
                    return np.full((batch, sequence, 1), 0.5, dtype=np.float32)

            return DKTStub()

        class DKTWithAttention(tf.keras.Model):  # type: ignore[misc]
            def __init__(self, num_skills: int, hidden_units: int = 100) -> None:
                super().__init__()
                self.lstm = tf.keras.layers.LSTM(
                    hidden_units,
                    return_sequences=True,
                    dropout=0.3,
                    recurrent_dropout=0.2,
                )
                self.attention = tf.keras.layers.Attention()
                self.output_layer = tf.keras.layers.Dense(num_skills, activation="sigmoid")

            def call(self, inputs: Any, training: bool = False) -> Any:  # pragma: no cover - tensorflow execution
                lstm_out = self.lstm(inputs, training=training)
                attention_out = self.attention([lstm_out, lstm_out])
                return self.output_layer(attention_out)

        model = DKTWithAttention(self.num_skills, self.hidden_units)
        model.compile(optimizer="adam", loss="binary_crossentropy")
        return model

    def trace_knowledge_state(self, session: LearningSession) -> Mapping[str, float]:
        encoded = self._encode_session(session)
        predictions = self._predict(encoded)
        mastery_vector = predictions[:, -1, :].mean(axis=0)
        skill_scores = {f"skill_{idx}": float(score) for idx, score in enumerate(mastery_vector)}
        self.skill_graph.update_mastery(skill_scores)
        return {
            "coverage": float(mastery_vector.mean()),
            "recommended_difficulty": float(1.0 - mastery_vector.mean()),
            "skill_mastery": skill_scores,
        }

    def _encode_session(self, session: LearningSession) -> np.ndarray:
        sequence_vectors = []
        for interaction in session.interactions:
            vector = np.zeros(self.num_skills * 2, dtype=np.float32)
            skill_idx = int(interaction.get("skill_index", 0)) % self.num_skills
            correctness = 1.0 if interaction.get("correct", False) else 0.0
            vector[skill_idx] = 1.0
            vector[skill_idx + self.num_skills] = correctness
            sequence_vectors.append(vector)

        if not sequence_vectors:
            sequence_vectors.append(np.zeros(self.num_skills * 2, dtype=np.float32))

        return np.expand_dims(np.stack(sequence_vectors), axis=0)

    def _predict(self, encoded_sequence: np.ndarray) -> np.ndarray:
        if hasattr(self.model, "predict"):
            return self.model.predict(encoded_sequence, verbose=0)
        return self.model(encoded_sequence, training=False)  # type: ignore[call-arg]

    def knowledge_snapshot(self) -> Mapping[str, float]:
        return self.skill_graph.export_state()
