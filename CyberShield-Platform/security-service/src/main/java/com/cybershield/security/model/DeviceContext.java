package com.cybershield.security.model;

import java.time.Instant;

public record DeviceContext(String deviceId, double riskScore, boolean trusted, Instant evaluatedAt) {
}
