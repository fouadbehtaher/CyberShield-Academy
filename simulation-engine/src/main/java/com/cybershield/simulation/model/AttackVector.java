package com.cybershield.simulation.model;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class AttackVector {

    private List<String> sequence;
    private double difficulty;
    private List<String> learningObjectives;
    private Duration timeToLive;
    private Map<String, Object> metadata;
}
