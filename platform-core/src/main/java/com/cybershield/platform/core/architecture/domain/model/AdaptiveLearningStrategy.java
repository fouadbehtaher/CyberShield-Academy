package com.cybershield.platform.core.architecture.domain.model;

public interface AdaptiveLearningStrategy {

    LearningPath buildAdaptivePath(SkillGapAnalysisResult analysisResult,
                                   String learningStyle,
                                   int cognitiveLoadCapacity);
}
