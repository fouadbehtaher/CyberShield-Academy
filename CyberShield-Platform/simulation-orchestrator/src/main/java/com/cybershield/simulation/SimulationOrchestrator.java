package com.cybershield.simulation;

import com.cybershield.simulation.model.SimulationRequest;
import com.cybershield.simulation.model.SimulationSession;
import com.cybershield.simulation.model.advanced.SimulationComponent;
import com.cybershield.simulation.model.advanced.SimulationEnvironment;
import com.cybershield.simulation.model.advanced.SimulationScenario;
import com.cybershield.simulation.services.MetricsCollectorService;
import com.cybershield.simulation.services.ScenarioComposerService;
import io.fabric8.kubernetes.api.model.ContainerBuilder;
import io.fabric8.kubernetes.api.model.EnvVarBuilder;
import io.fabric8.kubernetes.api.model.IntOrString;
import io.fabric8.kubernetes.api.model.Namespace;
import io.fabric8.kubernetes.api.model.NamespaceBuilder;
import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.api.model.ObjectMetaBuilder;
import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.api.model.PodBuilder;
import io.fabric8.kubernetes.api.model.PodSpec;
import io.fabric8.kubernetes.api.model.PodSpecBuilder;
import io.fabric8.kubernetes.api.model.ResourceRequirements;
import io.fabric8.kubernetes.api.model.ResourceRequirementsBuilder;
import io.fabric8.kubernetes.api.model.Service;
import io.fabric8.kubernetes.api.model.ServiceBuilder;
import io.fabric8.kubernetes.api.model.ServicePortBuilder;
import io.fabric8.kubernetes.api.model.networking.v1.LabelSelectorBuilder;
import io.fabric8.kubernetes.api.model.networking.v1.NetworkPolicy;
import io.fabric8.kubernetes.api.model.networking.v1.NetworkPolicyBuilder;
import io.fabric8.kubernetes.api.model.networking.v1.NetworkPolicyEgressRuleBuilder;
import io.fabric8.kubernetes.api.model.networking.v1.NetworkPolicyIngressRuleBuilder;
import io.fabric8.kubernetes.api.model.networking.v1.NetworkPolicyPeerBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SimulationOrchestrator {

    private final KubernetesClient kubernetesClient;
    private final ScenarioComposerService scenarioComposer;
    private final MetricsCollectorService metricsCollector;

    public SimulationOrchestrator(KubernetesClient kubernetesClient,
                                  ScenarioComposerService scenarioComposer,
                                  MetricsCollectorService metricsCollector) {
        this.kubernetesClient = kubernetesClient;
        this.scenarioComposer = scenarioComposer;
        this.metricsCollector = metricsCollector;
    }

    @Async("simulationExecutor")
    public CompletableFuture<SimulationSession> createAdvancedSimulation(SimulationRequest request) {
        SimulationScenario scenario = scenarioComposer.composeScenario(
                request.getScenarioType(),
                request.getDifficultyLevel(),
                request.getLearningObjectives()
        );

        SimulationEnvironment environment = deploySimulationEnvironment(scenario);

        configureNetworkIsolation(environment);

        metricsCollector.startMetricsCollection(environment.getSessionId());

        SimulationSession session = new SimulationSession(environment, scenario);
        log.info("Simulation session {} created for scenario {}", session.sessionId(), scenario.getName());
        return CompletableFuture.completedFuture(session);
    }

    private SimulationEnvironment deploySimulationEnvironment(SimulationScenario scenario) {
        String namespaceName = "simulation-" + UUID.randomUUID();

        Namespace namespace = new NamespaceBuilder()
                .withNewMetadata()
                .withName(namespaceName)
                .addToLabels("purpose", "cybersecurity-training")
                .addToLabels("sessionId", scenario.getSessionId())
                .endMetadata()
                .build();

        kubernetesClient.namespaces().create(namespace);
        log.debug("Created namespace {} for simulation session {}", namespaceName, scenario.getSessionId());

        scenario.getComponents().forEach(component -> {
            Pod pod = new PodBuilder()
                    .withMetadata(createPodMetadata(component, namespaceName, scenario.getSessionId()))
                    .withSpec(createPodSpec(component))
                    .build();
            kubernetesClient.pods().inNamespace(namespaceName).create(pod);
            log.debug("Deployed component {} into namespace {}", component.getName(), namespaceName);
        });

        configureNetworkServices(namespaceName, scenario);

        return new SimulationEnvironment(namespaceName, scenario.getSessionId());
    }

    private ObjectMeta createPodMetadata(SimulationComponent component, String namespace, String sessionId) {
        return new ObjectMetaBuilder()
                .withName(component.getName())
                .withNamespace(namespace)
                .addToLabels("sessionId", sessionId)
                .addToLabels("componentName", component.getName())
                .addToLabels("componentType", component.getType())
                .build();
    }

    private PodSpec createPodSpec(SimulationComponent component) {
        ContainerBuilder containerBuilder = new ContainerBuilder()
            .withName(component.getName())
            .withImage(component.getImage());

        Map<String, String> env = component.getEnv();
        if (env != null && !env.isEmpty()) {
            containerBuilder.withEnv(env.entrySet().stream()
                .map(entry -> new EnvVarBuilder().withName(entry.getKey()).withValue(entry.getValue()).build())
                .toList());
        }

        Map<String, Map<String, String>> resources = component.getResources();
        if (resources != null && !resources.isEmpty()) {
            ResourceRequirementsBuilder requirementsBuilder = new ResourceRequirementsBuilder();
            resources.forEach((type, values) -> {
            if ("limits".equalsIgnoreCase(type)) {
                requirementsBuilder.withLimits(values);
            } else if ("requests".equalsIgnoreCase(type)) {
                requirementsBuilder.withRequests(values);
            }
            });
            ResourceRequirements requirements = requirementsBuilder.build();
            containerBuilder.withResources(requirements);
        }

        PodSpecBuilder specBuilder = new PodSpecBuilder();
        specBuilder.withContainers(containerBuilder.build());
        return specBuilder.build();
    }

    private void configureNetworkIsolation(SimulationEnvironment environment) {
        log.info("Configuring network isolation for session {}", environment.getSessionId());
        String namespace = environment.getNamespace();
        String sessionId = environment.getSessionId();

        NetworkPolicy policy = new NetworkPolicyBuilder()
                .withNewMetadata()
                .withName("session-" + sessionId + "-isolation")
                .withNamespace(namespace)
                .addToLabels("sessionId", sessionId)
                .addToLabels("managedBy", "simulation-orchestrator")
                .endMetadata()
                .withNewSpec()
                .withPodSelector(new LabelSelectorBuilder().addToMatchLabels("sessionId", sessionId).build())
                .withPolicyTypes("Ingress", "Egress")
                .addToIngress(new NetworkPolicyIngressRuleBuilder()
                        .addToFrom(new NetworkPolicyPeerBuilder()
                                .withNewPodSelector()
                                .addToMatchLabels("sessionId", sessionId)
                                .endPodSelector()
                                .build())
                        .build())
                .addToEgress(new NetworkPolicyEgressRuleBuilder()
                        .addToTo(new NetworkPolicyPeerBuilder()
                                .withNewPodSelector()
                                .addToMatchLabels("sessionId", sessionId)
                                .endPodSelector()
                                .build())
                        .build())
                .endSpec()
                .build();

        kubernetesClient.network().v1().networkPolicies().inNamespace(namespace).createOrReplace(policy);
        log.debug("NetworkPolicy {} applied in namespace {}", policy.getMetadata().getName(), namespace);
    }

    private void configureNetworkServices(String namespace, SimulationScenario scenario) {
        log.info("Configuring network services for namespace {}", namespace);
        scenario.getComponents().forEach(component -> {
            String serviceName = sanitizeName(component.getName()) + "-svc";
            int targetPort = resolvePort(component);

            Service service = new ServiceBuilder()
                    .withNewMetadata()
                    .withName(serviceName)
                    .withNamespace(namespace)
                    .addToLabels("sessionId", scenario.getSessionId())
                    .addToLabels("componentName", component.getName())
                    .addToLabels("managedBy", "simulation-orchestrator")
                    .endMetadata()
                    .withNewSpec()
                    .addToSelector("sessionId", scenario.getSessionId())
                    .addToSelector("componentName", component.getName())
                    .addToPorts(new ServicePortBuilder()
                            .withName("tcp-" + targetPort)
                            .withPort(targetPort)
                            .withTargetPort(new IntOrString(targetPort))
                            .build())
                    .withType("ClusterIP")
                    .endSpec()
                    .build();

            kubernetesClient.services().inNamespace(namespace).createOrReplace(service);
            log.debug("Exposed service {} for component {} on port {}", serviceName, component.getName(), targetPort);
        });
    }

    private String sanitizeName(String rawName) {
        String candidate = rawName == null ? "component" : rawName.toLowerCase(Locale.ROOT);
        candidate = candidate.replaceAll("[^a-z0-9-]", "-");
        if (candidate.isBlank()) {
            candidate = "component-" + UUID.randomUUID().toString().substring(0, 8);
        }
        return candidate.length() > 40 ? candidate.substring(0, 40) : candidate;
    }

    private int resolvePort(SimulationComponent component) {
        return component.getEnv().entrySet().stream()
                .filter(entry -> entry.getKey() != null && entry.getKey().toUpperCase(Locale.ROOT).endsWith("PORT"))
                .map(Map.Entry::getValue)
                .map(this::parsePort)
                .findFirst()
                .orElse(8080);
    }

    private int parsePort(String candidate) {
        try {
            return Integer.parseInt(candidate);
        } catch (NumberFormatException ex) {
            return 8080;
        }
    }
}
