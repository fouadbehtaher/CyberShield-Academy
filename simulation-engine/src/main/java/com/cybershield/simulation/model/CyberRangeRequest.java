package com.cybershield.simulation.model;

import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CyberRangeRequest {

    private final String sessionId;
    private final String userId;
    private final DifficultyLevel difficultyLevel;
    private final NetworkTopology networkTopology;
    private final List<TargetSystemBlueprint> targetSystemBlueprints;
    private final List<String> attackToolImages;
    private final Map<String, String> metadata;

    public List<TargetSystemBlueprint> getTargetSystemBlueprints() {
        return targetSystemBlueprints == null ? List.of() : targetSystemBlueprints;
    }

    public List<String> getAttackToolImages() {
        return attackToolImages == null ? List.of() : attackToolImages;
    }
}
