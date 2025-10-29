package com.cybershield.platform.core.architecture.domain.model;

import com.cybershield.platform.core.architecture.user.model.LearningProgress;
import java.util.Map;

public interface SkillGapAnalysisEngine {

    SkillGapAnalysisResult analyzeGaps(Map<String, Integer> currentSkills,
                                       Map<String, Integer> targetSkills,
                                       LearningProgress learningHistory);
}
