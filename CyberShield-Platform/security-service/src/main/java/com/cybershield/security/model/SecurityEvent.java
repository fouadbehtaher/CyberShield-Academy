package com.cybershield.security.model;

import java.time.Instant;

public record SecurityEvent(
        String principal,
        String action,
        DeviceContext deviceContext,
        LocationContext locationContext,
        Instant timestamp) {

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private String principal;
        private String action;
        private DeviceContext deviceContext;
        private LocationContext locationContext;
        private Instant timestamp;

        private Builder() {
        }

        public Builder withPrincipal(String principal) {
            this.principal = principal;
            return this;
        }

        public Builder withAction(String action) {
            this.action = action;
            return this;
        }

        public Builder withDeviceContext(DeviceContext deviceContext) {
            this.deviceContext = deviceContext;
            return this;
        }

        public Builder withLocationContext(LocationContext locationContext) {
            this.locationContext = locationContext;
            return this;
        }

        public Builder withTimestamp(Instant timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public SecurityEvent build() {
            return new SecurityEvent(principal, action, deviceContext, locationContext, timestamp);
        }
    }
}
