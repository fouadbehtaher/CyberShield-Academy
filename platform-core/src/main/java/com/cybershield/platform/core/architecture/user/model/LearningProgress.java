package com.cybershield.platform.core.architecture.user.model;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

public class LearningProgress {

    private final Map<String, CompletionRecord> completions = new LinkedHashMap<>();

    public void recordCompletion(String moduleId, double score, Instant timestamp) {
        completions.put(moduleId, new CompletionRecord(score, timestamp));
    }

    public Map<String, CompletionRecord> getCompletions() {
        return Map.copyOf(completions);
    }

    public record CompletionRecord(double score, Instant timestamp) {
    }
}
