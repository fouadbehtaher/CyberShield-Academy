package com.cybershield.platform.core.architecture.domain.model;

public interface KnowledgeGraphRepository {

    LearningPath enhanceWithPrerequisites(LearningPath path);

    LearningPath optimizeForEfficiency(LearningPath path);
}
