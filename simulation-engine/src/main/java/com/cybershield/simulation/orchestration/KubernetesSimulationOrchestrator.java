package com.cybershield.simulation.orchestration;

import com.cybershield.simulation.exception.SimulationOrchestrationException;
import com.cybershield.simulation.management.NetworkPolicyManager;
import com.cybershield.simulation.metrics.MetricsCollectorService;
import com.cybershield.simulation.model.CyberRangeRequest;
import com.cybershield.simulation.model.NetworkSegmentConfig;
import com.cybershield.simulation.model.NetworkTopology;
import com.cybershield.simulation.model.SimulationEnvironment;
import com.cybershield.simulation.template.SimulationTemplateEngine;
import io.fabric8.kubernetes.api.model.Namespace;
import io.fabric8.kubernetes.api.model.NamespaceBuilder;
import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.api.model.networking.v1.NetworkPolicy;
import io.fabric8.kubernetes.api.model.networking.v1.NetworkPolicyBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.ForkJoinPool;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Orchestrates full-stack cyber range simulations directly on Kubernetes clusters.
 */
@Service
@Slf4j
public class KubernetesSimulationOrchestrator {

    private final KubernetesClient kubernetesClient;
    private final SimulationTemplateEngine templateEngine;
    private final NetworkPolicyManager networkPolicyManager;
    private final MetricsCollectorService metricsCollector;
    private final Executor simulationExecutor;

    @Autowired
    public KubernetesSimulationOrchestrator(
            KubernetesClient kubernetesClient,
            SimulationTemplateEngine templateEngine,
            NetworkPolicyManager networkPolicyManager,
            MetricsCollectorService metricsCollector,
            ObjectProvider<Executor> simulationExecutorProvider) {
        this.kubernetesClient = kubernetesClient;
        this.templateEngine = templateEngine;
        this.networkPolicyManager = networkPolicyManager;
        this.metricsCollector = metricsCollector;
        this.simulationExecutor = simulationExecutorProvider.getIfAvailable(ForkJoinPool::commonPool);
    }

    public CompletableFuture<SimulationEnvironment> createAdvancedCyberRange(CyberRangeRequest request) {
        log.info("Provisioning advanced cyber range for session {}", request.getSessionId());

        return CompletableFuture.supplyAsync(() -> {
            try {
                String namespace = createIsolatedNamespace(request);
                NetworkTopology topology = deployNetworkTopology(namespace, request);
                List<Pod> targetSystems = deployTargetSystems(namespace, request);
                configureAdvancedNetworkPolicies(namespace, topology);
                deployAttackDefenseTools(namespace, request);
                startComprehensiveMetricsCollection(namespace);
                return new SimulationEnvironment(namespace, topology, targetSystems);
            } catch (Exception ex) {
                log.error("Failed to create cyber range environment", ex);
                throw new SimulationOrchestrationException("Failed to create cyber range: " + ex.getMessage(), ex);
            }
        }, simulationExecutor);
    }

    private String createIsolatedNamespace(CyberRangeRequest request) {
        String namespace = "cyber-range-" + UUID.randomUUID().toString().substring(0, 8);

        Namespace ns = new NamespaceBuilder()
                .withNewMetadata()
                .withName(namespace)
                .withLabels(Map.of(
                        "purpose", "cybersecurity-training",
                        "sessionId", request.getSessionId(),
                        "userId", request.getUserId(),
                        "difficulty", request.getDifficultyLevel().name()))
                .withAnnotations(Map.of(
                        "description", "Isolated cyber range for advanced training",
                        "createdBy", "CyberShield Academy"))
                .endMetadata()
                .build();

        kubernetesClient.namespaces().resource(ns).create();
        templateEngine.applyResourceQuota(namespace);
        return namespace;
    }

    private NetworkTopology deployNetworkTopology(String namespace, CyberRangeRequest request) {
        NetworkTopology topology = Objects.requireNonNullElseGet(
                request.getNetworkTopology(), NetworkTopology::emptyTopology);

        deployNetworkSegment(namespace, "dmz", topology.getDmzConfig());
        deployNetworkSegment(namespace, "corporate", topology.getCorporateConfig());
        deployNetworkSegment(namespace, "restricted", topology.getRestrictedConfig());
        deployInternetSimulation(namespace);
        return topology;
    }

    private void deployNetworkSegment(String namespace, String segment, NetworkSegmentConfig config) {
        if (config == null) {
            log.warn("Skipping deployment for segment {} due to missing configuration", segment);
            return;
        }

        Map<String, String> selectorLabels = Map.of("network-segment", segment);

        NetworkPolicy policy = new NetworkPolicyBuilder()
                .withNewMetadata()
                .withName(segment + "-isolation")
                .withNamespace(namespace)
                .withLabels(config.labels())
                .endMetadata()
                .withNewSpec()
                .withPodSelector(config.podSelector(selectorLabels))
                .withPolicyTypes(List.of("Ingress", "Egress"))
                .addNewIngress()
                .addNewFrom()
                .withPodSelector(config.podSelector(selectorLabels))
                .endFrom()
                .endIngress()
                .addNewEgress()
                .addNewTo()
                .withPodSelector(config.podSelector(selectorLabels))
                .endTo()
                .endEgress()
                .endSpec()
                .build();

        kubernetesClient.network().v1().networkPolicies().inNamespace(namespace).resource(policy).create();
        templateEngine.deploySegmentResources(namespace, segment, config);
    }

    private void deployInternetSimulation(String namespace) {
        templateEngine.deployInternetBastion(namespace);
    }

    private List<Pod> deployTargetSystems(String namespace, CyberRangeRequest request) {
        List<Pod> pods = templateEngine.renderTargetSystems(namespace, request);
        return pods == null ? Collections.emptyList() : pods;
    }

    private void configureAdvancedNetworkPolicies(String namespace, NetworkTopology topology) {
        networkPolicyManager.applyAdvancedPolicies(namespace, topology);
    }

    private void deployAttackDefenseTools(String namespace, CyberRangeRequest request) {
        templateEngine.deployAttackDefenseTooling(namespace, request);
    }

    private void startComprehensiveMetricsCollection(String namespace) {
        metricsCollector.startCollection(namespace, Duration.ofSeconds(5));
    }
}
