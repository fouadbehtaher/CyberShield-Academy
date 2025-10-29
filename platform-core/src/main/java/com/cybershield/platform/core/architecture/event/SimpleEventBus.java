package com.cybershield.platform.core.architecture.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SimpleEventBus implements EventBus {

    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleEventBus.class);

    @Override
    public void publish(Object event) {
        LOGGER.debug("Publishing domain event {}", event);
    }
}
