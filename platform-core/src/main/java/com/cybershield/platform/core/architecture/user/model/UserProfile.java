package com.cybershield.platform.core.architecture.user.model;

import java.util.Map;

public class UserProfile {

    private final String username;
    private final Map<String, Integer> currentSkills;
    private final String learningStyle;
    private final int cognitiveLoadCapacity;
    private final LearningProgress learningHistory;

    public UserProfile(String username,
                       Map<String, Integer> currentSkills,
                       String learningStyle,
                       int cognitiveLoadCapacity,
                       LearningProgress learningHistory) {
        this.username = username;
        this.currentSkills = currentSkills;
        this.learningStyle = learningStyle;
        this.cognitiveLoadCapacity = cognitiveLoadCapacity;
        this.learningHistory = learningHistory;
    }

    public String getUsername() {
        return username;
    }

    public Map<String, Integer> getCurrentSkills() {
        return Map.copyOf(currentSkills);
    }

    public String getLearningStyle() {
        return learningStyle;
    }

    public int getCognitiveLoadCapacity() {
        return cognitiveLoadCapacity;
    }

    public LearningProgress getLearningHistory() {
        return learningHistory;
    }
}
