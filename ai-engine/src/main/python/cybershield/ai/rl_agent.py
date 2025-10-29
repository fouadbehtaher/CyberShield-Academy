from __future__ import annotations

import logging
import random
from collections import deque
from dataclasses import dataclass
from typing import Deque, Iterable, Tuple

import numpy as np

from .models import LearningSession

try:
    import tensorflow as tf  # type: ignore
except ImportError:  # pragma: no cover - runtime guard
    tf = None  # type: ignore


LOGGER = logging.getLogger(__name__)


@dataclass(slots=True)
class ReplayBuffer:
    """Experience replay buffer for off-policy reinforcement learning."""

    capacity: int

    def __post_init__(self) -> None:
        self._buffer: Deque[Tuple[np.ndarray, int, float, np.ndarray, bool]] = deque(maxlen=self.capacity)

    def add(self, state: np.ndarray, action: int, reward: float, next_state: np.ndarray, done: bool) -> None:
        self._buffer.append((state, int(action), float(reward), next_state, bool(done)))

    def sample(self, batch_size: int) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        batch = random.sample(self._buffer, k=min(batch_size, len(self._buffer)))
        states, actions, rewards, next_states, dones = zip(*batch)
        return (
            np.stack(states),
            np.array(actions, dtype=np.int32),
            np.array(rewards, dtype=np.float32),
            np.stack(next_states),
            np.array(dones, dtype=np.float32),
        )

    def __len__(self) -> int:
        return len(self._buffer)


class RLAdaptiveLearningAgent:
    """Dueling DQN agent that adapts learning paths for CyberShield Academy."""

    def __init__(self, state_space: int, action_space: int, learning_rate: float = 1e-3) -> None:
        self.state_space = state_space
        self.action_space = action_space
        self.memory = ReplayBuffer(capacity=100_000)
        self.gamma = 0.99
        self.learning_rate = learning_rate

        if tf is None:  # pragma: no cover - environment safeguard
            LOGGER.warning("TensorFlow unavailable, falling back to heuristic policy for RL agent.")
            self.q_network = self._build_stub()
            self.target_network = self.q_network
            self.optimizer = None
            self.loss_fn = None
        else:
            self.q_network = self._build_q_network()
            self.target_network = self._build_q_network()
            self.target_network.set_weights(self.q_network.get_weights())
            self.optimizer = tf.keras.optimizers.Adam(learning_rate=self.learning_rate)
            self.loss_fn = tf.keras.losses.Huber()

    def _build_stub(self):
        action_space = self.action_space

        class StubModel:
            def predict(self, inputs: np.ndarray, verbose: int = 0) -> np.ndarray:
                batch = inputs.shape[0]
                return np.zeros((batch, action_space), dtype=np.float32)

            def __call__(self, inputs: np.ndarray) -> np.ndarray:
                return self.predict(inputs)

        return StubModel()

    def _build_q_network(self):  # pragma: no cover - requires TensorFlow
        inputs = tf.keras.Input(shape=(self.state_space,))
        x = tf.keras.layers.Dense(512, activation="relu")(inputs)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.Dropout(0.3)(x)
        x = tf.keras.layers.Dense(256, activation="relu")(x)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.Dropout(0.3)(x)

        value_stream = tf.keras.layers.Dense(128, activation="relu")(x)
        value = tf.keras.layers.Dense(1)(value_stream)

        advantage_stream = tf.keras.layers.Dense(128, activation="relu")(x)
        advantage = tf.keras.layers.Dense(self.action_space)(advantage_stream)
        advantage = tf.keras.layers.Lambda(lambda a: a - tf.reduce_mean(a, axis=1, keepdims=True))(advantage)

        q_values = tf.keras.layers.Add()([value, advantage])
        model = tf.keras.Model(inputs=inputs, outputs=q_values)
        model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=self.learning_rate), loss="mse")
        return model

    def select_action(self, state: np.ndarray, epsilon: float) -> int:
        if np.random.random() < epsilon:
            return int(np.random.randint(self.action_space))
        state_batch = np.expand_dims(state, axis=0)
        q_values = self.q_network.predict(state_batch) if hasattr(self.q_network, "predict") else self.q_network(state_batch)
        return int(np.argmax(q_values[0]))

    def store_experience(self, session: LearningSession, action: int, reward: float, next_session: LearningSession, done: bool) -> None:
        state = np.array(session.feature_vector(), dtype=np.float32)
        next_state = np.array(next_session.feature_vector(), dtype=np.float32)
        self.memory.add(state, action, reward, next_state, done)

    def train(self, batch_size: int = 64) -> float:
        if tf is None or self.optimizer is None or self.loss_fn is None:
            return 0.0
        if len(self.memory) < batch_size:
            return 0.0

        states, actions, rewards, next_states, dones = self.memory.sample(batch_size)
        future_q = self.target_network.predict(next_states, verbose=0)
        max_future_q = np.max(future_q, axis=1)
        targets = rewards + self.gamma * (1 - dones) * max_future_q

        with tf.GradientTape() as tape:
            q_values = self.q_network(states, training=True)
            action_indices = tf.stack([tf.range(batch_size), tf.convert_to_tensor(actions)], axis=1)
            selected_q = tf.gather_nd(q_values, action_indices)
            loss = self.loss_fn(targets, selected_q)

        gradients = tape.gradient(loss, self.q_network.trainable_variables)
        self.optimizer.apply_gradients(zip(gradients, self.q_network.trainable_variables))
        return float(loss.numpy())

    def update_target_network(self) -> None:
        if tf is None or not hasattr(self.target_network, "set_weights"):
            return
        self.target_network.set_weights(self.q_network.get_weights())

    def policy_suggest(self, session: LearningSession, epsilon: float = 0.1) -> int:
        state = np.array(session.feature_vector(), dtype=np.float32)
        return self.select_action(state, epsilon)
