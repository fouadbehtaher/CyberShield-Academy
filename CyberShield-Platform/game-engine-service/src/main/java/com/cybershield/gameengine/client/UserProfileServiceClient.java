package com.cybershield.gameengine.client;

import java.net.URI;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class UserProfileServiceClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserProfileServiceClient.class);

    private final RestTemplate restTemplate;
    private final URI baseUri;
    private final ConcurrentMap<String, Integer> pointCache = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, Set<String>> badgeCache = new ConcurrentHashMap<>();

    public UserProfileServiceClient(RestTemplateBuilder restTemplateBuilder,
                                    @Value("${services.user-profile.base-url:http://user-profile-service}") String baseUrl) {
        this.restTemplate = restTemplateBuilder.build();
        this.baseUri = URI.create(Objects.requireNonNull(baseUrl, "baseUrl must not be null"));
    }

    public int updateUserPoints(String userId, int pointsDelta) {
        Objects.requireNonNull(userId, "userId must not be null");
        if (pointsDelta == 0) {
            return pointCache.getOrDefault(userId, 0);
        }

        pointCache.merge(userId, pointsDelta, (current, delta) -> Integer.valueOf(Math.max(0, current + delta)));
        int newTotal = Math.max(0, pointCache.getOrDefault(userId, 0));
        pointCache.put(userId, newTotal);
        URI target = baseUri.resolve(String.format("/api/users/%s/points", userId));

        try {
            RequestEntity<PointsUpdateRequest> request = RequestEntity
                    .post(target)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new PointsUpdateRequest(pointsDelta));
            restTemplate.exchange(request, Void.class);
        } catch (RestClientException ex) {
            LOGGER.warn("Failed to propagate point update to user-profile-service for user {}: {}", userId, ex.getMessage());
        }

        return newTotal;
    }

    public void registerBadge(String userId, String badgeCode) {
        Objects.requireNonNull(userId, "userId must not be null");
        Objects.requireNonNull(badgeCode, "badgeCode must not be null");

        String normalizedBadge = normalizeBadgeCode(badgeCode);
        badgeCache.computeIfAbsent(userId, ignored -> ConcurrentHashMap.newKeySet())
            .add(normalizedBadge);

        URI target = baseUri.resolve(String.format("/api/users/%s/badges", userId));

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<BadgeAwardRequest> entity = new HttpEntity<>(new BadgeAwardRequest(normalizedBadge), headers);
            restTemplate.exchange(target, HttpMethod.POST, entity, Void.class);
        } catch (RestClientException ex) {
            LOGGER.warn("Failed to notify user-profile-service about badge {} for user {}: {}",
                    badgeCode, userId, ex.getMessage());
        }
    }

    private String normalizeBadgeCode(String badgeCode) {
        return badgeCode.trim().toUpperCase(Locale.ROOT).replace(' ', '_');
    }

    private record PointsUpdateRequest(int delta) {}

    private record BadgeAwardRequest(String badge) {}
}
