package com.cybershield.simulation.model;

import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class TargetSystem {

    private String name;
    private String description;
    private List<String> capabilities;
    private Map<String, Object> metadata;
}
