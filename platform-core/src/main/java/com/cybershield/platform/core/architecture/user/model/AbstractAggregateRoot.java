package com.cybershield.platform.core.architecture.user.model;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractAggregateRoot {

    private final List<Object> uncommittedEvents = new ArrayList<>();

    protected void apply(Object event) {
        this.uncommittedEvents.add(event);
        handleEvent(event);
    }

    protected abstract void handleEvent(Object event);

    public List<Object> getUncommittedEvents() {
        return List.copyOf(uncommittedEvents);
    }

    public void clearEvents() {
        uncommittedEvents.clear();
    }
}
