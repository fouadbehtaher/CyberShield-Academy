package com.cybershield.simulation.orchestration;

import com.cybershield.simulation.library.AttackVectorLibrary;
import com.cybershield.simulation.library.DefenseMechanismLibrary;
import com.cybershield.simulation.library.MLScenarioGenerator;
import com.cybershield.simulation.model.AttackVector;
import com.cybershield.simulation.model.DefenseMechanism;
import com.cybershield.simulation.model.MLGeneratedScenario;
import com.cybershield.simulation.model.ScenarioParameters;
import com.cybershield.simulation.model.SimulationScenario;
import com.cybershield.simulation.model.TargetSystem;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DynamicScenarioComposer {

    private final AttackVectorLibrary attackVectorLibrary;
    private final DefenseMechanismLibrary defenseLibrary;
    private final MLScenarioGenerator mlGenerator;

    public SimulationScenario composeDynamicScenario(ScenarioParameters params) {
        MLGeneratedScenario mlScenario = mlGenerator.generateScenario(
                params.getUserSkillLevel(),
                params.getLearningObjectives(),
                params.getPreferredAttackVectors());

        SimulationScenario scenario = new SimulationScenario();
        scenario.setParameters(params);
        scenario.setTargetSystems(composeDynamicTargetSystems(mlScenario));
        scenario.setAttackVectors(composeProgressiveAttacks(mlScenario));
        scenario.setDefenseMechanisms(composeAdaptiveDefenses(mlScenario));
        scenario.setEvaluationCriteria(composeIntelligentEvaluation(mlScenario));
        return scenario;
    }

    private List<TargetSystem> composeDynamicTargetSystems(MLGeneratedScenario mlScenario) {
        return mlScenario.getTargetSystemBlueprints().stream()
                .map(attackVectorLibrary::materializeTargetSystem)
                .collect(Collectors.toList());
    }

    private List<AttackVector> composeProgressiveAttacks(MLGeneratedScenario mlScenario) {
        return mlScenario.getAttackSequences().stream()
                .map(sequence -> {
                    AttackVector vector = new AttackVector();
                    vector.setSequence(sequence.getSteps());
                    vector.setDifficulty(calculateDynamicDifficulty(sequence.getBaselineDifficulty(), sequence.getAdaptiveSignals()));
                    vector.setLearningObjectives(sequence.getObjectives());
                    vector.setTimeToLive(sequence.getEstimatedDuration());
                    return vector;
                })
                .collect(Collectors.toList());
    }

    private List<DefenseMechanism> composeAdaptiveDefenses(MLGeneratedScenario mlScenario) {
        return mlScenario.getDefensePatterns().stream()
                .map(pattern -> defenseLibrary.materializeDefense(pattern, mlScenario.getContextSignals()))
                .collect(Collectors.toList());
    }

    private Map<String, Object> composeIntelligentEvaluation(MLGeneratedScenario mlScenario) {
        return mlScenario.getEvaluationBlueprint();
    }

    private double calculateDynamicDifficulty(double baseline, Map<String, Double> adaptiveSignals) {
        double adjustment = adaptiveSignals.values().stream().mapToDouble(v -> v).sum();
        return Math.min(10.0, Math.max(1.0, baseline + adjustment));
    }
}
