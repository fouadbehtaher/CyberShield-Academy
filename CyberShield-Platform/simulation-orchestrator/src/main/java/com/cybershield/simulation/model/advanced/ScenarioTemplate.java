package com.cybershield.simulation.model.advanced;

import com.cybershield.simulation.model.DifficultyLevel;
import java.util.ArrayList;
import java.util.List;

public class ScenarioTemplate {

    private String name;
    private List<SimulationComponent> defaultComponents = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<SimulationComponent> getDefaultComponents() {
        return defaultComponents;
    }

    public void setDefaultComponents(List<SimulationComponent> defaultComponents) {
        this.defaultComponents = defaultComponents;
    }

    public SimulationScenario toScenario() {
        SimulationScenario scenario = new SimulationScenario();
        scenario.setName(name);
        scenario.setComponents(new ArrayList<>(defaultComponents));
        return scenario;
    }

    public NetworkTopology generateTopology(DifficultyLevel difficulty) {
        NetworkTopology topology = new NetworkTopology();
        topology.setNodes(List.of("gateway", "internal-segment", "dmz"));
        topology.setConnections(List.of("gateway->internal-segment", "gateway->dmz"));
        return topology;
    }
}
