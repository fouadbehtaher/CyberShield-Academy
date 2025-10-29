package com.cybershield.simulation.model;

import io.fabric8.kubernetes.api.model.Pod;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SimulationEnvironment {

    private final String namespace;
    private final NetworkTopology networkTopology;
    private final List<Pod> targetSystems;
}
