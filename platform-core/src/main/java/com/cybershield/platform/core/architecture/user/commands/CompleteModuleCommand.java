package com.cybershield.platform.core.architecture.user.commands;

import java.time.Instant;

public class CompleteModuleCommand {

    private final String userId;
    private final String moduleId;
    private final double score;
    private final Instant timestamp;

    public CompleteModuleCommand(String userId, String moduleId, double score, Instant timestamp) {
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
