package com.cybershield.security.service;

import com.cybershield.security.model.LocationContext;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Set;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class LocationPolicyEvaluator {

    private static final Set<String> BLOCKED_COUNTRY_CODES = Set.of("KP", "IR", "SY");
    private static final String COUNTRY_HEADER = "X-Country-Code";
    private static final String IP_HEADER = "X-Forwarded-For";

    public LocationContext evaluate(HttpServletRequest request) {
        String countryCode = resolveCountry(request);
        String ipAddress = resolveIp(request);
        boolean allowed = !BLOCKED_COUNTRY_CODES.contains(countryCode);
        return new LocationContext(countryCode, ipAddress, allowed);
    }

    private String resolveCountry(HttpServletRequest request) {
        return StringUtils.hasText(request.getHeader(COUNTRY_HEADER))
                ? request.getHeader(COUNTRY_HEADER)
                : "UNKNOWN";
    }

    private String resolveIp(HttpServletRequest request) {
        String forwarded = request.getHeader(IP_HEADER);
        if (StringUtils.hasText(forwarded)) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
