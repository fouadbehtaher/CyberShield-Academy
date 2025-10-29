package com.cybershield.simulation.template;

import com.cybershield.simulation.model.CyberRangeRequest;
import com.cybershield.simulation.model.NetworkSegmentConfig;
import com.cybershield.simulation.model.TargetSystemBlueprint;
import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.api.model.PodBuilder;
import io.fabric8.kubernetes.api.model.ResourceQuota;
import io.fabric8.kubernetes.api.model.ResourceQuotaBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SimulationTemplateEngine {

    private final KubernetesClient kubernetesClient;

    public void applyResourceQuota(String namespace) {
        ResourceQuota quota = new ResourceQuotaBuilder()
                .withNewMetadata()
                .withName("simulation-quota")
                .withNamespace(namespace)
                .endMetadata()
                .withNewSpec()
                .withHard(Map.of(
                        "requests.cpu", "4",
                        "requests.memory", "8Gi",
                        "limits.cpu", "8",
                        "limits.memory", "16Gi",
                        "pods", "20"))
                .endSpec()
                .build();

        kubernetesClient.resourceQuotas().inNamespace(namespace).resource(quota).create();
    }

    public void deploySegmentResources(String namespace, String segment, NetworkSegmentConfig config) {
        log.info("Deploying supplementary resources for segment {} in namespace {}", segment, namespace);
        // Placeholder for ConfigMap/Deployment templating logic.
    }

    public void deployInternetBastion(String namespace) {
        log.info("Deploying internet simulation bastion into namespace {}", namespace);
        // Placeholder for Bastion host deployments or external service mocks.
    }

    public List<Pod> renderTargetSystems(String namespace, CyberRangeRequest request) {
        List<Pod> pods = new ArrayList<>();
        for (TargetSystemBlueprint blueprint : request.getTargetSystemBlueprints()) {
            Pod pod = new PodBuilder()
                    .withNewMetadata()
                    .withName(blueprint.getName())
                    .withNamespace(namespace)
                .withLabels(blueprint.getLabels() == null ? Map.of() : blueprint.getLabels())
                .withAnnotations(blueprint.getAnnotations() == null ? Map.of() : blueprint.getAnnotations())
                    .endMetadata()
                    .withNewSpec()
                    .addNewContainer()
                    .withName(blueprint.getName() + "-container")
                    .withImage(blueprint.getImage())
                .withPorts((blueprint.getPorts() == null ? List.<Integer>of() : blueprint.getPorts()).stream()
                    .map(port -> new io.fabric8.kubernetes.api.model.ContainerPortBuilder()
                        .withContainerPort(port)
                        .build())
                    .collect(Collectors.toList()))
                    .endContainer()
                    .endSpec()
                    .build();

            kubernetesClient.pods().inNamespace(namespace).resource(pod).create();
            pods.add(pod);
        }
        return pods;
    }

    public void deployAttackDefenseTooling(String namespace, CyberRangeRequest request) {
        for (String image : request.getAttackToolImages()) {
            log.info("Deploying tool {} into namespace {}", image, namespace);
        }
    }
}
