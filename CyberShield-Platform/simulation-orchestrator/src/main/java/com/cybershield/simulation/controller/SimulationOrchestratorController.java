package com.cybershield.simulation.controller;

import com.cybershield.simulation.model.SimulationRequest;
import com.cybershield.simulation.model.SimulationSession;
import com.cybershield.simulation.service.SimulationOrchestratorService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulations")
public class SimulationOrchestratorController {

    private final SimulationOrchestratorService simulationOrchestratorService;

    public SimulationOrchestratorController(SimulationOrchestratorService simulationOrchestratorService) {
        this.simulationOrchestratorService = simulationOrchestratorService;
    }

    @PostMapping("/start")
    public SimulationSession startSimulation(@RequestBody SimulationRequest simulationRequest) {
        return simulationOrchestratorService.startSimulation(simulationRequest);
    }

    @PostMapping("/stop/{sessionId}")
    public SimulationSession stopSimulation(@PathVariable String sessionId) {
        return simulationOrchestratorService.stopSimulation(sessionId);
    }
}
