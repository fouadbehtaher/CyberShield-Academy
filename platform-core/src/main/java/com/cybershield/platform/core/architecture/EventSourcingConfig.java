package com.cybershield.platform.core.architecture;

import com.cybershield.platform.core.architecture.annotations.EnableEventSourcing;
import com.cybershield.platform.core.architecture.event.EventBus;
import com.cybershield.platform.core.architecture.event.EventStore;
import com.cybershield.platform.core.architecture.event.JdbcEventStore;
import com.cybershield.platform.core.architecture.event.SimpleEventBus;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableEventSourcing
public class EventSourcingConfig {

    private final DataSource dataSource;

    public EventSourcingConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Bean
    public EventStore eventStore() {
        return new JdbcEventStore(dataSource);
    }

    @Bean
    public EventBus eventBus() {
        return new SimpleEventBus();
    }
}
