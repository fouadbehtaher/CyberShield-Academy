class RecommendationEngine {
  constructor() {
    this.userProfiles = new Map();
    this.contentMatrix = new Map();
  }

  async analyzeUserBehavior(userId, interactions) {
    const userInteractions = await this.getUserInteractions(userId, interactions);
    const similarUsers = await this.findSimilarUsers(userId);

    return this.generateRecommendations(userId, userInteractions, similarUsers);
  }

  async generatePersonalizedLearningPath(user) {
    const weakAreas = user.aiCoach.weakAreas;
    const learningStyle = user.aiCoach.learningStyle;
    const currentLevel = user.profile.level;

    const recommendations = Array.from(this.contentMatrix.values())
      .filter((content) =>
        content.difficulty <= currentLevel + 1 &&
        content.tags.some((tag) => weakAreas.includes(tag)) &&
        content.style === learningStyle
      )
      .sort((a, b) => this.calculateRelevanceScore(b, a, user));

    return recommendations.slice(0, 10);
  }

  calculateRelevanceScore(contentA, contentB, user) {
    const difficultyMatch = 1 - Math.abs(contentA.difficulty - user.profile.level) / 10;

    const interestMatch = contentA.tags.filter((tag) =>
      user.profile.skills.some((skill) => skill.name === tag)
    ).length / (contentA.tags.length || 1);

    const styleMatch = contentA.style === user.aiCoach.learningStyle ? 1 : 0.5;

    return (difficultyMatch * 0.4) + (interestMatch * 0.4) + (styleMatch * 0.2);
  }

  async getUserInteractions(userId, interactions = []) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, { interactions: [] });
    }
    const profile = this.userProfiles.get(userId);
    profile.interactions.push(...interactions);
    return profile.interactions;
  }

  async findSimilarUsers(userId) {
    return Array.from(this.userProfiles.entries())
      .filter(([id]) => id !== userId)
      .map(([, profile]) => profile);
  }

  async generateRecommendations(userId, userInteractions, similarUsers) {
    return Array.from(this.contentMatrix.values()).slice(0, 10);
  }
}

module.exports = RecommendationEngine;
