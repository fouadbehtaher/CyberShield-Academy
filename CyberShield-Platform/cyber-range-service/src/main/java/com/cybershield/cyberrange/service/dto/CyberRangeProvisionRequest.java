package com.cybershield.cyberrange.service.dto;

import io.fabric8.kubernetes.api.model.ContainerBuilder;
import io.fabric8.kubernetes.api.model.EnvVarBuilder;
import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.api.model.PodBuilder;
import io.fabric8.kubernetes.api.model.Quantity;
import io.fabric8.kubernetes.api.model.ResourceRequirements;
import io.fabric8.kubernetes.api.model.ResourceRequirementsBuilder;

import java.util.Map;

public record CyberRangeProvisionRequest(
    String environmentId,
    String scenarioId,
    String requestedBy,
    String image,
    int cpu,
    int memoryMi,
    Map<String, String> environment
) {

    public Pod toPod(String namespace, Map<String, String> labels) {
        Map<String, String> envVars = environment == null ? Map.of() : environment;

        return new PodBuilder()
            .withNewMetadata()
                .withName("cyber-range-" + environmentId)
                .withNamespace(namespace)
                .withLabels(labels)
            .endMetadata()
            .withNewSpec()
                .withContainers(new ContainerBuilder()
                    .withName("scenario")
                    .withImage(image)
                    .withResources(ResourceBuilderFactory.create(cpu, memoryMi))
                    .withEnv(envVars.entrySet().stream()
                        .map(entry -> new EnvVarBuilder()
                            .withName(entry.getKey())
                            .withValue(entry.getValue())
                            .build())
                        .toList())
                    .build())
                .withRestartPolicy("Never")
            .endSpec()
            .build();
    }

    private static final class ResourceBuilderFactory {
        private ResourceBuilderFactory() {
        }

        private static ResourceRequirements create(int cpu, int memoryMi) {
            return new ResourceRequirementsBuilder()
                .withLimits(Map.of(
                    "cpu", new Quantity(String.valueOf(cpu)),
                    "memory", new Quantity(memoryMi + "Mi")
                ))
                .withRequests(Map.of(
                    "cpu", new Quantity(String.valueOf(Math.max(1, cpu / 2))),
                    "memory", new Quantity(Math.max(256, memoryMi / 2) + "Mi")
                ))
                .build();
        }
    }
}
