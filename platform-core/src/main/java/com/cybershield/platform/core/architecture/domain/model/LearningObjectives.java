package com.cybershield.platform.core.architecture.domain.model;

import java.util.Map;

public class LearningObjectives {

    private final Map<String, Integer> targetSkills;

    public LearningObjectives(Map<String, Integer> targetSkills) {
        this.targetSkills = targetSkills;
    }

    public Map<String, Integer> getTargetSkills() {
        return Map.copyOf(targetSkills);
    }
}
