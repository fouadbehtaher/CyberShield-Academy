package com.cybershield.analytics.model;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public record UserAnalytics(
    String userId,
    Instant generatedAt,
    Map<String, Number> aggregatedMetrics,
    List<String> recommendedActions
) {

    public static UserAnalytics empty(String userId) {
        return new UserAnalytics(
            userId,
            Instant.now(),
            Collections.emptyMap(),
            Collections.emptyList()
        );
    }
}
