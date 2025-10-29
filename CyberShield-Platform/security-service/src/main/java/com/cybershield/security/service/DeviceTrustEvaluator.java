package com.cybershield.security.service;

import com.cybershield.security.model.DeviceContext;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.Optional;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class DeviceTrustEvaluator {

    private static final String DEVICE_ID_HEADER = "X-Device-Id";
    private static final String DEVICE_RISK_HEADER = "X-Device-Risk";

    public DeviceContext evaluate(HttpServletRequest request) {
        String deviceId = extractDeviceId(request);
        double riskScore = extractRiskScore(request);
        boolean trusted = isDeviceTrusted(deviceId, riskScore);
        return new DeviceContext(deviceId, riskScore, trusted, Instant.now());
    }

    private String extractDeviceId(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(DEVICE_ID_HEADER))
                .filter(StringUtils::hasText)
                .orElse("UNKNOWN_DEVICE");
    }

    private double extractRiskScore(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(DEVICE_RISK_HEADER))
                .filter(StringUtils::hasText)
                .map(Double::parseDouble)
                .orElse(0.2);
    }

    private boolean isDeviceTrusted(String deviceId, double riskScore) {
        if (!StringUtils.hasText(deviceId)) {
            return false;
        }
        return riskScore <= 0.6;
    }
}
