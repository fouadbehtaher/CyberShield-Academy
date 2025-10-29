package com.cybershield.platform.core.architecture.domain.model;

import java.util.Map;

public class SkillGapAnalysisResult {

    private final Map<String, Double> gaps;

    public SkillGapAnalysisResult(Map<String, Double> gaps) {
        this.gaps = gaps;
    }

    public Map<String, Double> getGaps() {
        return gaps;
    }
}
