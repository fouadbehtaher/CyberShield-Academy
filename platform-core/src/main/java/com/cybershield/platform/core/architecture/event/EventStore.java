package com.cybershield.platform.core.architecture.event;

public interface EventStore {
    void append(Object event);
}
