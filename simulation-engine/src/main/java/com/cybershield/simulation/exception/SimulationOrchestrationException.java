package com.cybershield.simulation.exception;

public class SimulationOrchestrationException extends RuntimeException {

    public SimulationOrchestrationException(String message) {
        super(message);
    }

    public SimulationOrchestrationException(String message, Throwable cause) {
        super(message, cause);
    }
}
