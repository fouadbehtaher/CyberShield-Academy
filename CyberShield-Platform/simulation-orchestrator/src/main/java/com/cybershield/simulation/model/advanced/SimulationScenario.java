package com.cybershield.simulation.model.advanced;

import com.cybershield.simulation.model.DifficultyLevel;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SimulationScenario {

    private String id = UUID.randomUUID().toString();
    private String sessionId = UUID.randomUUID().toString();
    private String name = "generated-scenario";
    private List<SimulationComponent> components = new ArrayList<>();
    private List<AttackVector> attackVectors = new ArrayList<>();
    private List<DefenseMechanism> defenseMechanisms = new ArrayList<>();
    private NetworkTopology networkTopology;
    private List<String> evaluationCriteria = new ArrayList<>();
    private DifficultyLevel difficultyLevel = DifficultyLevel.BEGINNER;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<SimulationComponent> getComponents() {
        return components;
    }

    public void setComponents(List<SimulationComponent> components) {
        this.components = components;
    }

    public List<AttackVector> getAttackVectors() {
        return attackVectors;
    }

    public void setAttackVectors(List<AttackVector> attackVectors) {
        this.attackVectors = attackVectors;
    }

    public List<DefenseMechanism> getDefenseMechanisms() {
        return defenseMechanisms;
    }

    public void setDefenseMechanisms(List<DefenseMechanism> defenseMechanisms) {
        this.defenseMechanisms = defenseMechanisms;
    }

    public NetworkTopology getNetworkTopology() {
        return networkTopology;
    }

    public void setNetworkTopology(NetworkTopology networkTopology) {
        this.networkTopology = networkTopology;
    }

    public List<String> getEvaluationCriteria() {
        return evaluationCriteria;
    }

    public void setEvaluationCriteria(List<String> evaluationCriteria) {
        this.evaluationCriteria = evaluationCriteria;
    }

    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }
}
