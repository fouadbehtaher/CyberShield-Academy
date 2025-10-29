package com.cybershield.simulation.services;

import com.cybershield.simulation.model.AttackVector;
import com.cybershield.simulation.model.DifficultyLevel;
import com.cybershield.simulation.model.LearningObjective;
import com.cybershield.simulation.model.ScenarioType;
import com.cybershield.simulation.model.defense.DefenseMechanism;
import com.cybershield.simulation.model.network.NetworkTopology;
import com.cybershield.simulation.model.advanced.ScenarioTemplate;
import com.cybershield.simulation.model.advanced.SimulationScenario;
import com.cybershield.simulation.repositories.AttackVectorLibrary;
import com.cybershield.simulation.repositories.DefenseMechanismLibrary;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ScenarioComposerService {

    private final Map<String, ScenarioTemplate> scenarioTemplates;
    private final AttackVectorLibrary attackVectorLibrary;
    private final DefenseMechanismLibrary defenseLibrary;

    public ScenarioComposerService(Map<String, ScenarioTemplate> scenarioTemplates,
                                   AttackVectorLibrary attackVectorLibrary,
                                   DefenseMechanismLibrary defenseLibrary) {
        this.scenarioTemplates = scenarioTemplates;
        this.attackVectorLibrary = attackVectorLibrary;
        this.defenseLibrary = defenseLibrary;
    }

    public SimulationScenario composeScenario(ScenarioType type,
                                              DifficultyLevel difficulty,
                                              Set<LearningObjective> objectives) {

        ScenarioTemplate template = scenarioTemplates.get(type.name());
        SimulationScenario scenario = template != null ? template.toScenario() : new SimulationScenario();

        scenario.setAttackVectors(composeAttackVectors(difficulty, objectives));
        scenario.setDefenseMechanisms(composeDefenseMechanisms(difficulty));
        scenario.setNetworkTopology(composeNetworkTopology(type, difficulty));
        scenario.setEvaluationCriteria(composeEvaluationCriteria(objectives));

        return scenario;
    }

    private List<AttackVector> composeAttackVectors(DifficultyLevel difficulty,
                                                    Set<LearningObjective> objectives) {
        if (objectives == null || objectives.isEmpty()) {
            return attackVectorLibrary.getVectors().stream()
                    .filter(vector -> vector.getDifficulty().ordinal() <= difficulty.ordinal())
                    .sorted(Comparator.comparing(AttackVector::getComplexity))
                    .limit(calculateVectorCount(difficulty))
                    .collect(Collectors.toList());
        }

        return attackVectorLibrary.getVectors().stream()
                .filter(vector -> vector.getDifficulty().ordinal() <= difficulty.ordinal())
                .filter(vector -> objectives.stream()
                        .anyMatch(obj -> obj.getSkills().contains(vector.getTargetSkill())))
                .sorted(Comparator.comparing(AttackVector::getComplexity))
                .limit(calculateVectorCount(difficulty))
                .collect(Collectors.toList());
    }

    private List<DefenseMechanism> composeDefenseMechanisms(DifficultyLevel difficulty) {
        return defenseLibrary.getMechanisms().stream()
                .filter(defense -> defense.getDifficulty().ordinal() <= difficulty.ordinal())
                .collect(Collectors.toList());
    }

    private NetworkTopology composeNetworkTopology(ScenarioType type, DifficultyLevel difficulty) {
        ScenarioTemplate template = scenarioTemplates.getOrDefault(type.name(), new ScenarioTemplate());
        return template.generateTopology(difficulty);
    }

    private List<String> composeEvaluationCriteria(Set<LearningObjective> objectives) {
        if (objectives == null) {
            return Collections.emptyList();
        }
        return objectives.stream()
                .flatMap(obj -> obj.getEvaluationCriteria().stream())
                .distinct()
                .collect(Collectors.toList());
    }

    private long calculateVectorCount(DifficultyLevel difficulty) {
        return switch (difficulty) {
            case BEGINNER -> 3L;
            case INTERMEDIATE -> 5L;
            case ADVANCED -> 7L;
            case EXPERT -> 9L;
        };
    }
}
