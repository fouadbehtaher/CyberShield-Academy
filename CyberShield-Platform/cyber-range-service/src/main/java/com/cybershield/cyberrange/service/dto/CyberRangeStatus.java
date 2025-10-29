package com.cybershield.cyberrange.service.dto;

import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.api.model.PodStatus;

public record CyberRangeStatus(
    String environmentId,
    String phase,
    String message,
    long provisioningDurationMs
) {

    public static CyberRangeStatus provisioned(String environmentId, long provisioningDurationMs) {
        return new CyberRangeStatus(environmentId, "Provisioned", "", provisioningDurationMs);
    }

    public static CyberRangeStatus failed(String environmentId, String message) {
        return new CyberRangeStatus(environmentId, "Failed", message, 0);
    }

    public static CyberRangeStatus fromPod(String environmentId, Pod pod) {
        PodStatus status = pod.getStatus();
        String phase = status != null ? status.getPhase() : "Unknown";
        String message = "";
        if (status != null && status.getConditions() != null && !status.getConditions().isEmpty()) {
            message = status.getConditions().get(status.getConditions().size() - 1).getMessage();
        }
        return new CyberRangeStatus(environmentId, phase, message, 0);
    }
}
