package com.cybershield.security.service;

import com.cybershield.security.model.SecurityEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SecurityAuditService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityAuditService.class);

    public void record(SecurityEvent event) {
        LOGGER.info("Security audit event: principal={}, action={}, device={}, location={}",
                event.principal(),
                event.action(),
                event.deviceContext().deviceId(),
                event.locationContext().ipAddress());
    }
}
