package com.cybershield.simulation.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NetworkTopology {

    private final NetworkSegmentConfig dmzConfig;
    private final NetworkSegmentConfig corporateConfig;
    private final NetworkSegmentConfig restrictedConfig;

    public static NetworkTopology emptyTopology() {
        return NetworkTopology.builder().build();
    }
}
