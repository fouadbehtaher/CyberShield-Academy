package com.cybershield.simulation.model.advanced;

import java.util.ArrayList;
import java.util.List;

public class NetworkTopology {

    private List<String> nodes = new ArrayList<>();
    private List<String> connections = new ArrayList<>();

    public List<String> getNodes() {
        return nodes;
    }

    public void setNodes(List<String> nodes) {
        this.nodes = nodes;
    }

    public List<String> getConnections() {
        return connections;
    }

    public void setConnections(List<String> connections) {
        this.connections = connections;
    }
}
