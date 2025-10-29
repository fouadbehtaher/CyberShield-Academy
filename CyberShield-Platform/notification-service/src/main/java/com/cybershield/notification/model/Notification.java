package com.cybershield.notification.model;

import java.time.Instant;
import java.util.Map;

public record Notification(
    String type,
    String message,
    Instant createdAt,
    Map<String, Object> data
) {
    public static Notification of(String type, String message, Map<String, Object> data) {
        return new Notification(type, message, Instant.now(), data);
    }
}
