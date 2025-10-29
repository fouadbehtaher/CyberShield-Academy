package com.cybershield.platform.core.architecture.event;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;
import javax.sql.DataSource;

public class JdbcEventStore implements EventStore {

    private static final String TABLE_NAME = "domain_events";

    private final DataSource dataSource;
    private final ObjectMapper objectMapper;
    private final AtomicBoolean schemaInitialized = new AtomicBoolean(false);

    public JdbcEventStore(DataSource dataSource) {
        this(dataSource, new ObjectMapper());
    }

    public JdbcEventStore(DataSource dataSource, ObjectMapper objectMapper) {
        this.dataSource = Objects.requireNonNull(dataSource, "dataSource must not be null");
        this.objectMapper = Objects.requireNonNull(objectMapper, "objectMapper must not be null");
    }

    @Override
    public void append(Object event) {
        Objects.requireNonNull(event, "event must not be null");
        ensureSchema();

        String eventType = event.getClass().getName();
        String payload = toJson(event);

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(
                     "INSERT INTO " + TABLE_NAME + " (event_type, payload, created_at) VALUES (?, ?, ?)")
        ) {
            statement.setString(1, eventType);
            statement.setString(2, payload);
            statement.setTimestamp(3, Timestamp.from(Instant.now()));
            statement.executeUpdate();
        } catch (SQLException ex) {
            throw new IllegalStateException("Failed to append event to store", ex);
        }
    }

    private void ensureSchema() {
        if (schemaInitialized.compareAndSet(false, true)) {
            String createTableSql = ("""
                    CREATE TABLE IF NOT EXISTS %s (
                        id BIGSERIAL PRIMARY KEY,
                        event_type VARCHAR(255) NOT NULL,
                        payload TEXT NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE NOT NULL
                    )
                    """).formatted(TABLE_NAME);
            try (Connection connection = dataSource.getConnection();
                 Statement statement = connection.createStatement()
            ) {
                statement.execute(createTableSql);
            } catch (SQLException ex) {
                throw new IllegalStateException("Failed to initialize event store schema", ex);
            }
        }
    }

    private String toJson(Object event) {
        try {
            return objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Unable to serialize event of type " + event.getClass().getName(), ex);
        }
    }
}
