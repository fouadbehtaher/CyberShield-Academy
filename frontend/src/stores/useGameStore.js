import axios from 'axios';
import { io } from 'socket.io-client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useGameStore = create(devtools((set, get) => ({
  user: null,
  currentWorld: 'cyber-city',
  activeSimulation: null,
  aiCoach: null,
  notifications: [],

  initializeUser: async (userData) => {
    set({ user: userData });
    await get().loadAIRecommendations();
    await get().initializeGameWorld();
  },

  loadAIRecommendations: async () => {
    const { user } = get();
    if (!user) return;
    const response = await axios.get(`/api/ai/recommendations/${user.id}`);
    set({ aiCoach: response.data });
  },

  initializeGameWorld: async () => {
    const worldConfig = await import('../worlds/cyber-city/config');
    set({ currentWorld: worldConfig.default ?? worldConfig });
  },

  startSimulation: async (scenario) => {
    const { user } = get();
    if (!user) return;

    const simulation = await axios.post('/api/simulations/start', {
      userId: user.id,
      scenario
    });

    set({ activeSimulation: simulation.data });

    const socket = io('/simulation');
    socket.emit('join-simulation', simulation.data.id);
  },

  completeChallenge: async (challengeId, score) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = await axios.patch(`/api/users/${user.id}/progress`, {
      challengeId,
      score,
      timestamp: new Date()
    });

    set({ user: updatedUser.data });
    get().addExperience(score * 10);

    await axios.post('/api/ai/update-progress', {
      userId: user.id,
      challengeId,
      performance: score
    });
  },

  addExperience: (amount) => {
    const { user } = get();
    if (!user) return;

    const newExp = user.profile.experience + amount;
    const newLevel = Math.floor(newExp / 1000) + 1;

    set({
      user: {
        ...user,
        profile: {
          ...user.profile,
          experience: newExp,
          level: newLevel
        }
      }
    });

    if (newLevel > user.profile.level) {
      get().triggerLevelUp(newLevel);
    }
  },

  triggerLevelUp: (newLevel) => {
    const notifications = get().notifications;
    set({
      notifications: [
        ...notifications,
        {
          type: 'level-up',
          message: `🎉 Level Up! You reached level ${newLevel}`,
          timestamp: new Date()
        }
      ]
    });
  }
})));

export default useGameStore;
