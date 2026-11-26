package com.cybershield.analytics.model;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.kafka.support.serializer.JsonSerializer;

/** The producer in application.yml uses JsonSerializer for values; check it can write a UserEvent. */
class UserEventJsonTest {

    @Test
    void jsonSerializerWritesAUserEventWithItsInstant() {
        try (JsonSerializer<Object> serializer = new JsonSerializer<>()) {
            byte[] bytes = serializer.serialize("user-events", UserEvent.of("u1", "login", Map.of("k", 1)));
            String json = new String(bytes, StandardCharsets.UTF_8);
            assertTrue(json.contains("\"userId\":\"u1\""));
            assertTrue(json.contains("\"type\":\"login\""));
            assertTrue(json.contains("occurredAt"));
        }
    }
}
