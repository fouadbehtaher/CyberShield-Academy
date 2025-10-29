package com.cybershield.simulation.metrics;

import java.time.Duration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MetricsCollectorService {

    private final TaskScheduler taskScheduler;

    public MetricsCollectorService(ObjectProvider<TaskScheduler> schedulerProvider) {
        this.taskScheduler = schedulerProvider.getIfAvailable();
    }

    public void startCollection(String namespace, Duration pollingInterval) {
        log.info("Starting metrics collection for namespace {} with interval {}", namespace, pollingInterval);
        if (taskScheduler != null) {
            taskScheduler.scheduleAtFixedRate(
                    () -> log.debug("Collecting metrics for namespace {}", namespace),
                    pollingInterval);
        }
    }
}
