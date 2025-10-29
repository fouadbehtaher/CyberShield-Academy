package com.cybershield.simulation.model.advanced;

public class SimulationEnvironment {

    private final String namespace;
    private final String sessionId;

    public SimulationEnvironment(String namespace, String sessionId) {
        this.namespace = namespace;
        this.sessionId = sessionId;
    }

    public String getNamespace() {
        return namespace;
    }

    public String getSessionId() {
        return sessionId;
    }
}
