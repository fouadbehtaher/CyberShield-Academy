package com.cybershield.platform.core.architecture.domain;

import com.cybershield.platform.core.architecture.annotations.DomainService;
import com.cybershield.platform.core.architecture.domain.model.AdaptiveLearningStrategy;
import com.cybershield.platform.core.architecture.domain.model.KnowledgeGraphRepository;
import com.cybershield.platform.core.architecture.domain.model.LearningObjectives;
import com.cybershield.platform.core.architecture.domain.model.LearningPath;
import com.cybershield.platform.core.architecture.domain.model.PersonalizedLearningPath;
import com.cybershield.platform.core.architecture.domain.model.SkillGapAnalysisEngine;
import com.cybershield.platform.core.architecture.domain.model.SkillGapAnalysisResult;
import com.cybershield.platform.core.architecture.user.model.UserProfile;
import org.springframework.transaction.annotation.Transactional;

@DomainService
public class LearningPathDomainService {

    private final SkillGapAnalysisEngine gapAnalysisEngine;
    private final AdaptiveLearningStrategy adaptiveStrategy;
    private final KnowledgeGraphRepository knowledgeGraphRepo;

    public LearningPathDomainService(SkillGapAnalysisEngine gapAnalysisEngine,
                                     AdaptiveLearningStrategy adaptiveStrategy,
                                     KnowledgeGraphRepository knowledgeGraphRepo) {
        this.gapAnalysisEngine = gapAnalysisEngine;
        this.adaptiveStrategy = adaptiveStrategy;
        this.knowledgeGraphRepo = knowledgeGraphRepo;
    }

    @Transactional
    public PersonalizedLearningPath createLearningPath(UserProfile userProfile,
                                                        LearningObjectives objectives) {
        SkillGapAnalysisResult gapAnalysis = gapAnalysisEngine.analyzeGaps(
            userProfile.getCurrentSkills(),
            objectives.getTargetSkills(),
            userProfile.getLearningHistory()
        );

        LearningPath path = adaptiveStrategy.buildAdaptivePath(
            gapAnalysis,
            userProfile.getLearningStyle(),
            userProfile.getCognitiveLoadCapacity()
        );

        path = knowledgeGraphRepo.enhanceWithPrerequisites(path);
        path = knowledgeGraphRepo.optimizeForEfficiency(path);

        return new PersonalizedLearningPath(path.getModuleSequence());
    }
}
