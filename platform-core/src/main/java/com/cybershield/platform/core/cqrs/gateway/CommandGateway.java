package com.cybershield.platform.core.cqrs.gateway;

import java.util.concurrent.CompletableFuture;

public interface CommandGateway {

    CompletableFuture<Void> send(Object command);
}
