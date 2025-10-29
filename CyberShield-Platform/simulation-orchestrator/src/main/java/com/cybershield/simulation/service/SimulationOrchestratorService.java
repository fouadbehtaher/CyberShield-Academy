package com.cybershield.simulation.service;

import com.cybershield.simulation.model.SimulationRequest;
import com.cybershield.simulation.model.SimulationSession;
import com.cybershield.simulation.model.SimulationStatus;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class SimulationOrchestratorService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Map<String, SimulationSession> activeSessions = new ConcurrentHashMap<>();

    public SimulationOrchestratorService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public SimulationSession startSimulation(SimulationRequest simulationRequest) {
        SimulationSession session = new SimulationSession();
        session.setSessionId(UUID.randomUUID().toString());
        session.setUserId(simulationRequest.getUserId());
        session.setScenarioId(simulationRequest.getScenarioId());
        session.setStatus(SimulationStatus.STARTING);
        session.setStartTime(Instant.now());
        Map<String, Object> parameters = simulationRequest.getParameters() != null
            ? simulationRequest.getParameters()
            : Map.of();
        session.setResults(Map.copyOf(parameters));

        activeSessions.put(session.getSessionId(), session);
        kafkaTemplate.send("simulation-events", session.getSessionId(), session);

        session.setStatus(SimulationStatus.RUNNING);
        return session;
    }

    public SimulationSession stopSimulation(String sessionId) {
        SimulationSession session = activeSessions.get(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Simulation session not found: " + sessionId);
        }

        session.setStatus(SimulationStatus.STOPPING);
        session.setEndTime(Instant.now());
        kafkaTemplate.send("simulation-events", sessionId, session);

        session.setStatus(SimulationStatus.STOPPED);
        activeSessions.remove(sessionId);
        return session;
    }
}
