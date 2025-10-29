package com.cybershield.simulation.library;

import com.cybershield.simulation.model.MLGeneratedScenario;
import com.cybershield.simulation.model.MLGeneratedScenario.AttackSequence;
import com.cybershield.simulation.model.MLGeneratedScenario.DefensePattern;
import com.cybershield.simulation.model.TargetSystemBlueprint;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class MLScenarioGenerator {

    public MLGeneratedScenario generateScenario(
            Object userSkillLevel,
            List<String> learningObjectives,
            List<String> preferredAttackVectors) {

        TargetSystemBlueprint blueprint = TargetSystemBlueprint.builder()
                .name("adaptive-target")
                .image("cybershield/target-system:latest")
                .ports(List.of(22, 80, 443))
                .labels(Map.of("network-segment", "corporate"))
                .build();

        AttackSequence attackSequence = AttackSequence.builder()
                .steps(List.of("initial-access", "privilege-escalation", "exfiltration"))
                .baselineDifficulty(5.0)
                .adaptiveSignals(Map.of("skillAdjustment", preferredAttackVectors.size() * 0.5))
                .objectives(learningObjectives)
                .estimatedDuration(Duration.ofMinutes(45))
                .build();

        DefensePattern defensePattern = DefensePattern.builder()
                .identifier("adaptive-defense")
                .parameters(Map.of("responseMode", "deception"))
                .build();

        return MLGeneratedScenario.builder()
                .targetSystemBlueprints(List.of(blueprint))
                .attackSequences(List.of(attackSequence))
                .defensePatterns(List.of(defensePattern))
                .contextSignals(Map.of("engagementScore", 0.7))
                .evaluationBlueprint(Map.of("successCriteria", "containment-within-30min"))
                .build();
    }
}
