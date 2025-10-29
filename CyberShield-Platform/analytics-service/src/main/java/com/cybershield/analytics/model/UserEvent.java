package com.cybershield.analytics.model;

import java.time.Instant;
import java.util.Map;

public record UserEvent(
    String userId,
    String type,
    Instant occurredAt,
    Map<String, Object> metadata
) {
    public static UserEvent of(String userId, String type, Map<String, Object> metadata) {
        return new UserEvent(userId, type, Instant.now(), metadata);
    }
}
