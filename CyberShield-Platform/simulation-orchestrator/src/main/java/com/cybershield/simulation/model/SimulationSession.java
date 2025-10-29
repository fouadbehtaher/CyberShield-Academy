package com.cybershield.simulation.model;

import com.cybershield.simulation.model.advanced.SimulationEnvironment;
import com.cybershield.simulation.model.advanced.SimulationScenario;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class SimulationSession {

    private String sessionId;
    private String userId;
    private String scenarioId;
    private SimulationStatus status;
    private Instant startTime;
    private Instant endTime;
    private Map<String, Object> results = new HashMap<>();

    public SimulationSession() {
    }

    public SimulationSession(SimulationEnvironment environment, SimulationScenario scenario) {
        this.sessionId = scenario.getSessionId();
        this.scenarioId = scenario.getId();
        this.status = SimulationStatus.RUNNING;
        this.startTime = Instant.now();
        this.results = new HashMap<>();
    }

    public String sessionId() {
        return sessionId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getScenarioId() {
        return scenarioId;
    }

    public void setScenarioId(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    public SimulationStatus getStatus() {
        return status;
    }

    public void setStatus(SimulationStatus status) {
        this.status = status;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Map<String, Object> getResults() {
        return results;
    }

    public void setResults(Map<String, Object> results) {
        this.results = results == null ? new HashMap<>() : new HashMap<>(results);
    }
}
