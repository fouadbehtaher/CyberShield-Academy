package com.cybershield.simulation.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MetricsCollectorService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MetricsCollectorService.class);

    public void startMetricsCollection(String sessionId) {
        LOGGER.info("Starting metrics collection for session {}", sessionId);
    }
}
