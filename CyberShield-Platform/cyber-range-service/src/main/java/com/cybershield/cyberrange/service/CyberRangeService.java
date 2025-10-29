package com.cybershield.cyberrange.service;

import com.cybershield.cyberrange.service.dto.CyberRangeProvisionRequest;
import com.cybershield.cyberrange.service.dto.CyberRangeStatus;
import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.api.model.PodList;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class CyberRangeService {

    private static final Logger LOGGER = LoggerFactory.getLogger(CyberRangeService.class);

    private final KubernetesClient kubernetesClient;
    private final String namespace;

    public CyberRangeService(KubernetesClient kubernetesClient,
                             @Value("${cyberrange.kubernetes.namespace:cyber-range}") String namespace) {
        this.kubernetesClient = kubernetesClient;
        this.namespace = namespace;
    }

    @Async
    public CompletableFuture<CyberRangeStatus> provisionEnvironment(CyberRangeProvisionRequest request) {
        Instant start = Instant.now();
        Map<String, String> labels = new HashMap<>();
        labels.put("environmentId", request.environmentId());
        labels.put("scenario", request.scenarioId());
        if (request.requestedBy() != null) {
            labels.put("owner", request.requestedBy());
        }

        try {
            Pod pod = kubernetesClient.pods()
                .inNamespace(namespace)
                .createOrReplace(request.toPod(namespace, labels));

            LOGGER.info("Provisioned cyber range environment {}", pod.getMetadata().getName());
            return CompletableFuture.completedFuture(CyberRangeStatus.provisioned(
                request.environmentId(),
                Duration.between(start, Instant.now()).toMillis()
            ));
        } catch (KubernetesClientException ex) {
            LOGGER.error("Failed to provision cyber range environment {}", request.environmentId(), ex);
            return CompletableFuture.completedFuture(CyberRangeStatus.failed(
                request.environmentId(),
                ex.getMessage()
            ));
        }
    }

    public Optional<CyberRangeStatus> getEnvironmentStatus(String environmentId) {
        PodList pods = kubernetesClient.pods()
            .inNamespace(namespace)
            .withLabel("environmentId", environmentId)
            .list();

        if (pods.getItems().isEmpty()) {
            return Optional.empty();
        }

        Pod pod = pods.getItems().get(0);
        return Optional.of(CyberRangeStatus.fromPod(environmentId, pod));
    }

    public boolean destroyEnvironment(String environmentId) {
        PodList pods = kubernetesClient.pods()
            .inNamespace(namespace)
            .withLabel("environmentId", environmentId)
            .list();

        if (pods.getItems().isEmpty()) {
            return false;
        }

        pods.getItems().forEach(pod -> kubernetesClient.pods()
            .inNamespace(namespace)
            .withName(pod.getMetadata().getName())
            .delete());

        LOGGER.info("Destroyed cyber range environment {}", environmentId);
        return true;
    }
}
