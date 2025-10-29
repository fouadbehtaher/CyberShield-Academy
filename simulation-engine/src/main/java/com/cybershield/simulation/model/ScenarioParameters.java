package com.cybershield.simulation.model;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ScenarioParameters {

    private final DifficultyLevel userSkillLevel;
    private final List<String> learningObjectives;
    private final List<String> preferredAttackVectors;
}
