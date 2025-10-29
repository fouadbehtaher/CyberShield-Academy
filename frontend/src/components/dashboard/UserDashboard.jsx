import React from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../stores/useGameStore';
import SkillRadarChart from './SkillRadarChart';
import ProgressTracker from './ProgressTracker';
import AICoachWidget from './AICoachWidget';
import RecommendedChallenges from './RecommendedChallenges';

const UserDashboard = () => {
  const { user, aiCoach, completeChallenge } = useGameStore();

  if (!user) {
    return <div className="dashboard-container">Loading user info...</div>;
  }

  return (
    <div className="dashboard-container">
      <motion.div
        className="status-bar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="level-indicator">
          <span>المستوى: {user.profile.level}</span>
          <div className="exp-bar">
            <div
              className="exp-fill"
              style={{ width: `${(user.profile.experience % 1000) / 10}%` }}
            />
          </div>
        </div>

        <div className="points-display">
          🏆 {user.gameStats.totalPoints} نقطة
        </div>
      </motion.div>

      <div className="dashboard-grid">
        <motion.div
          className="ai-coach-section"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AICoachWidget coach={aiCoach} />
        </motion.div>

        <motion.div
          className="skills-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <SkillRadarChart skills={user.profile.skills} />
        </motion.div>

        <motion.div
          className="challenges-section"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <RecommendedChallenges
            challenges={aiCoach?.recommendedContent || []}
            onChallengeComplete={completeChallenge}
          />
        </motion.div>

        <motion.div
          className="progress-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <ProgressTracker progress={user.learningPath} />
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
