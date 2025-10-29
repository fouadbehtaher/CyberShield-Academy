package com.cybershield.simulation.model;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MLGeneratedScenario {

    private final List<TargetSystemBlueprint> targetSystemBlueprints;
    private final List<AttackSequence> attackSequences;
    private final List<DefensePattern> defensePatterns;
    private final Map<String, Double> contextSignals;
    private final Map<String, Object> evaluationBlueprint;

    public List<TargetSystemBlueprint> getTargetSystemBlueprints() {
        return targetSystemBlueprints == null ? Collections.emptyList() : targetSystemBlueprints;
    }

    public List<AttackSequence> getAttackSequences() {
        return attackSequences == null ? Collections.emptyList() : attackSequences;
    }

    public List<DefensePattern> getDefensePatterns() {
        return defensePatterns == null ? Collections.emptyList() : defensePatterns;
    }

    public Map<String, Double> getContextSignals() {
        return contextSignals == null ? Map.of() : contextSignals;
    }

    public Map<String, Object> getEvaluationBlueprint() {
        return evaluationBlueprint == null ? Map.of() : evaluationBlueprint;
    }

    @Getter
    @Builder
    public static class AttackSequence {
        private final List<String> steps;
        private final double baselineDifficulty;
        private final Map<String, Double> adaptiveSignals;
        private final List<String> objectives;
        private final java.time.Duration estimatedDuration;

        public Map<String, Double> getAdaptiveSignals() {
            return adaptiveSignals == null ? Map.of() : adaptiveSignals;
        }
    }

    @Getter
    @Builder
    public static class DefensePattern {
        private final String identifier;
        private final Map<String, Object> parameters;
    }
}
