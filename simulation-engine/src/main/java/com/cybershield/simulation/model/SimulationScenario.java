package com.cybershield.simulation.model;

import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class SimulationScenario {

    private ScenarioParameters parameters;
    private List<TargetSystem> targetSystems;
    private List<AttackVector> attackVectors;
    private List<DefenseMechanism> defenseMechanisms;
    private Map<String, Object> evaluationCriteria;
}
