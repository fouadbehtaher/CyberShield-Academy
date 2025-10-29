package com.cybershield.security.service;

import com.cybershield.security.model.DeviceContext;
import com.cybershield.security.model.LocationContext;
import com.cybershield.security.model.SecurityEvent;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class ZeroTrustSecurityService {

    private final ContinuousAuthenticationValidator continuousAuthenticationValidator;
    private final DeviceTrustEvaluator deviceTrustEvaluator;
    private final LocationPolicyEvaluator locationPolicyEvaluator;
    private final LeastPrivilegeEnforcer leastPrivilegeEnforcer;
    private final SecurityAuditService securityAuditService;

    public ZeroTrustSecurityService(
            ContinuousAuthenticationValidator continuousAuthenticationValidator,
            DeviceTrustEvaluator deviceTrustEvaluator,
            LocationPolicyEvaluator locationPolicyEvaluator,
            LeastPrivilegeEnforcer leastPrivilegeEnforcer,
            SecurityAuditService securityAuditService) {
        this.continuousAuthenticationValidator = continuousAuthenticationValidator;
        this.deviceTrustEvaluator = deviceTrustEvaluator;
        this.locationPolicyEvaluator = locationPolicyEvaluator;
        this.leastPrivilegeEnforcer = leastPrivilegeEnforcer;
        this.securityAuditService = securityAuditService;
    }

    public SecurityContext enforceZeroTrust(Authentication authentication, HttpServletRequest request) {
        Assert.notNull(authentication, "Authentication cannot be null");

        if (!continuousAuthenticationValidator.isStillValid(authentication)) {
            throw new SecurityException("Continuous authentication failed");
        }

        DeviceContext deviceContext = deviceTrustEvaluator.evaluate(request);
        if (!deviceContext.isTrusted()) {
            throw new SecurityException("Untrusted device");
        }

        LocationContext locationContext = locationPolicyEvaluator.evaluate(request);
        if (!locationContext.isAllowed()) {
            throw new SecurityException("Access from restricted location");
        }

        Authentication scopedAuthentication = leastPrivilegeEnforcer.apply(authentication, request);

        SecurityEvent event = SecurityEvent.builder()
                .withPrincipal(authentication.getName())
                .withTimestamp(Instant.now())
                .withDeviceContext(deviceContext)
                .withLocationContext(locationContext)
                .withAction(request.getMethod() + " " + request.getRequestURI())
                .build();
        securityAuditService.record(event);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(scopedAuthentication);
        return context;
    }
}
