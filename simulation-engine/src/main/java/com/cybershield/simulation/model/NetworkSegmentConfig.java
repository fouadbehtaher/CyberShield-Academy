package com.cybershield.simulation.model;

import io.fabric8.kubernetes.api.model.LabelSelector;
import io.fabric8.kubernetes.api.model.LabelSelectorBuilder;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NetworkSegmentConfig {

    private final Map<String, String> labels;
    private final Map<String, String> annotations;

    public Map<String, String> labels() {
        return labels == null ? Map.of() : labels;
    }

    public LabelSelector podSelector(Map<String, String> defaults) {
        LabelSelectorBuilder builder = new LabelSelectorBuilder();
        builder.withMatchLabels(defaults);
        if (labels != null && !labels.isEmpty()) {
            builder.addToMatchLabels(labels);
        }
        return builder.build();
    }

    public Map<String, String> annotations() {
        return annotations == null ? Map.of() : annotations;
    }
}
