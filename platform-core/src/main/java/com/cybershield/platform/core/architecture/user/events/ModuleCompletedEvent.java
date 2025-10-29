package com.cybershield.platform.core.architecture.user.events;

import java.time.Instant;

public class ModuleCompletedEvent {

    private final String userId;
    private final String moduleId;
    private final double score;
    private final Instant timestamp;

    public ModuleCompletedEvent(String userId, String moduleId, double score, Instant timestamp) {
        this.userId = userId;
        this.moduleId = moduleId;
        this.score = score;
        this.timestamp = timestamp;
    }

    public String getUserId() {
        return userId;
    }

    public String getModuleId() {
        return moduleId;
    }

    public double getScore() {
        return score;
    }

    public Instant getTimestamp() {
        return timestamp;
    }
}
