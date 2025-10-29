package com.cybershield.platform.core.architecture.domain.model;

import java.util.List;

public class LearningPath {

    private final List<String> moduleSequence;

    public LearningPath(List<String> moduleSequence) {
        this.moduleSequence = List.copyOf(moduleSequence);
    }

    public List<String> getModuleSequence() {
        return moduleSequence;
    }
}
