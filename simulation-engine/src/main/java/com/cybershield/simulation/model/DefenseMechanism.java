package com.cybershield.simulation.model;

import java.util.Map;
import lombok.Data;

@Data
public class DefenseMechanism {

    private String name;
    private String activationTrigger;
    private Map<String, Object> parameters;
}
