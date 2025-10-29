package com.cybershield.simulation.model;

import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TargetSystemBlueprint {

    private final String name;
    private final String image;
    private final List<Integer> ports;
    private final Map<String, String> labels;
    private final Map<String, String> annotations;
    private final Map<String, Object> runtimeConfig;
}
