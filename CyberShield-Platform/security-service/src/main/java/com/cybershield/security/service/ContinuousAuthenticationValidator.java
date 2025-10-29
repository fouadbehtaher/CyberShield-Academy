package com.cybershield.security.service;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;

@Component
public class ContinuousAuthenticationValidator {

    private static final Duration MAX_SESSION_INACTIVITY = Duration.ofMinutes(30);

    public boolean isStillValid(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return isRecent(authentication) && hasIntegrity(authentication);
    }

    private boolean isRecent(Authentication authentication) {
        Instant lastInteraction = extractLastInteraction(authentication);
        return lastInteraction == null || Duration.between(lastInteraction, Instant.now()).compareTo(MAX_SESSION_INACTIVITY) <= 0;
    }

    private boolean hasIntegrity(Authentication authentication) {
        return Optional.ofNullable(authentication.getDetails())
                .filter(WebAuthenticationDetails.class::isInstance)
                .map(WebAuthenticationDetails.class::cast)
                .map(details -> details.getRemoteAddress() != null)
                .orElse(true);
    }

    private Instant extractLastInteraction(Authentication authentication) {
        return Optional.ofNullable(authentication.getDetails())
                .filter(SessionMetadata.class::isInstance)
                .map(SessionMetadata.class::cast)
                .map(SessionMetadata::lastInteraction)
                .orElse(null);
    }

    public record SessionMetadata(String sessionId, Instant lastInteraction) { }
}
