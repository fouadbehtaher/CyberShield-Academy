package com.cybershield.analytics.service;

import com.cybershield.analytics.model.UserAnalytics;
import com.cybershield.analytics.model.UserEvent;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.DoubleAdder;
import java.util.concurrent.atomic.LongAdder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AnalyticsService.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ConcurrentMap<String, AnalyticsAccumulator> aggregations = new ConcurrentHashMap<>();

    public AnalyticsService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void trackUserEvent(UserEvent userEvent) {
        Objects.requireNonNull(userEvent, "userEvent must not be null");

        kafkaTemplate.send("user-events", userEvent.userId(), userEvent);
        aggregations
            .computeIfAbsent(userEvent.userId(), ignored -> new AnalyticsAccumulator())
            .record(userEvent);

        LOGGER.debug("Queued user event {} for user {}", userEvent.type(), userEvent.userId());
    }

    public UserAnalytics getUserAnalytics(String userId) {
        LOGGER.debug("Fetching analytics snapshot for user {}", userId);
        return Optional.ofNullable(aggregations.get(userId))
                .map(accumulator -> accumulator.snapshot(userId))
                .orElseGet(() -> UserAnalytics.empty(userId));
    }

    private static final class AnalyticsAccumulator {

        private final LongAdder totalEvents = new LongAdder();
        private final ConcurrentMap<String, LongAdder> eventsByType = new ConcurrentHashMap<>();
        private final ConcurrentMap<String, DoubleAdder> numericSums = new ConcurrentHashMap<>();
        private final ConcurrentMap<String, LongAdder> numericCounts = new ConcurrentHashMap<>();
        private final ConcurrentMap<String, LongAdder> activityCounts = new ConcurrentHashMap<>();

        void record(UserEvent event) {
            totalEvents.increment();
            eventsByType.computeIfAbsent(event.type(), key -> new LongAdder()).increment();
            activityCounts.computeIfAbsent(event.type(), key -> new LongAdder()).increment();

            Map<String, Object> metadata = event.metadata();
            if (metadata == null || metadata.isEmpty()) {
                return;
            }

            metadata.forEach((key, value) -> {
                if (value instanceof Number number) {
                    numericSums.computeIfAbsent(key, ignored -> new DoubleAdder()).add(number.doubleValue());
                    numericCounts.computeIfAbsent(key, ignored -> new LongAdder()).increment();
                }
            });
        }

        UserAnalytics snapshot(String userId) {
            Map<String, Number> metrics = new ConcurrentHashMap<>();
            metrics.put("events.total", totalEvents.longValue());
            eventsByType.forEach((type, count) -> metrics.put("events." + type, count.longValue()));

            numericSums.forEach((key, sum) -> {
                double total = sum.doubleValue();
                long count = Optional.ofNullable(numericCounts.get(key)).map(LongAdder::longValue).orElse(0L);
                metrics.put("metrics." + key + ".sum", total);
                if (count > 0) {
                    metrics.put("metrics." + key + ".avg", total / count);
                }
            });

            List<String> recommendedActions = buildRecommendations(metrics);

            return new UserAnalytics(
                    userId,
                    Instant.now(),
                    Collections.unmodifiableMap(metrics),
                    Collections.unmodifiableList(recommendedActions)
            );
        }

        private List<String> buildRecommendations(Map<String, Number> metrics) {
            List<String> actions = new ArrayList<>();
            Number totalEventsValue = metrics.get("events.total");
            if (totalEventsValue != null && totalEventsValue.longValue() > 25) {
                actions.add("Surface adaptive difficulty recommendations to keep the learner engaged.");
            }

            eventsByType.forEach((type, counter) -> {
                long occurrences = counter.longValue();
                if (occurrences >= 10 && type.toLowerCase().contains("alert")) {
                    actions.add("Schedule a coaching session focusing on handling alerts of type " + type + '.');
                }
            });

            return actions;
        }
    }
}
