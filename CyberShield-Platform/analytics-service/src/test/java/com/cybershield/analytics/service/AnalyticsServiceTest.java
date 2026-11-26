package com.cybershield.analytics.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.cybershield.analytics.model.UserAnalytics;
import com.cybershield.analytics.model.UserEvent;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.kafka.core.KafkaTemplate;

class AnalyticsServiceTest {

    private KafkaTemplate<String, Object> kafka;
    private AnalyticsService service;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() {
        kafka = mock(KafkaTemplate.class);
        service = new AnalyticsService(kafka);
    }

    @Test
    void unknownUserGetsAnEmptySnapshot() {
        UserAnalytics result = service.getUserAnalytics("nobody");
        assertEquals("nobody", result.userId());
        assertTrue(result.aggregatedMetrics().isEmpty());
        assertTrue(result.recommendedActions().isEmpty());
    }

    @Test
    void trackedEventIsSentToKafkaKeyedByUser() {
        UserEvent event = UserEvent.of("u1", "login", Map.of());
        service.trackUserEvent(event);
        verify(kafka).send(eq("user-events"), eq("u1"), eq(event));
    }

    @Test
    void countsEventsPerTypeAndAveragesNumericMetadataOnly() {
        service.trackUserEvent(UserEvent.of("u1", "quiz", Map.of("score", 80, "note", "text")));
        service.trackUserEvent(UserEvent.of("u1", "quiz", Map.of("score", 60)));
        service.trackUserEvent(UserEvent.of("u1", "login", Map.of()));

        Map<String, Number> m = service.getUserAnalytics("u1").aggregatedMetrics();
        assertEquals(3L, m.get("events.total").longValue());
        assertEquals(2L, m.get("events.quiz").longValue());
        assertEquals(1L, m.get("events.login").longValue());
        assertEquals(140.0, m.get("metrics.score.sum").doubleValue(), 1e-9);
        assertEquals(70.0, m.get("metrics.score.avg").doubleValue(), 1e-9);
        assertTrue(!m.containsKey("metrics.note.sum"));
    }

    @Test
    void usersAreAggregatedSeparately() {
        service.trackUserEvent(UserEvent.of("a", "login", Map.of()));
        assertEquals(1L, service.getUserAnalytics("a").aggregatedMetrics().get("events.total").longValue());
        assertTrue(service.getUserAnalytics("b").aggregatedMetrics().isEmpty());
    }

    @Test
    void recommendationsAppearAfterMoreThan25EventsAndTenAlertEvents() {
        for (int i = 0; i < 26; i++) {
            service.trackUserEvent(UserEvent.of("u", i < 10 ? "phishing-alert" : "quiz", null));
        }
        var actions = service.getUserAnalytics("u").recommendedActions();
        assertEquals(2, actions.size());
        assertTrue(actions.stream().anyMatch(a -> a.contains("adaptive difficulty")));
        assertTrue(actions.stream().anyMatch(a -> a.contains("phishing-alert")));
    }

    @Test
    void fewEventsGiveNoRecommendations() {
        for (int i = 0; i < 25; i++) {
            service.trackUserEvent(UserEvent.of("u", "quiz", Map.of()));
        }
        assertTrue(service.getUserAnalytics("u").recommendedActions().isEmpty());
    }

    @Test
    void nullEventIsRejected() {
        assertThrows(NullPointerException.class, () -> service.trackUserEvent(null));
    }
}
