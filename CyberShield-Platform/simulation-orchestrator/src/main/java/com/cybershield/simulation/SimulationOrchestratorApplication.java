package com.cybershield.simulation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SimulationOrchestratorApplication {

    public static void main(String[] args) {
        SpringApplication.run(SimulationOrchestratorApplication.class, args);
    }
}
