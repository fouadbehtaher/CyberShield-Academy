package com.cybershield.gameengine.service;

import com.cybershield.gameengine.client.UserProfileServiceClient;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class GameEngineService {

    private static final Logger LOGGER = LoggerFactory.getLogger(GameEngineService.class);

    private static final Map<String, Integer> POINT_BADGE_THRESHOLDS = Map.of(
            "FOUNDATIONAL_DEFENDER", 100,
            "ADVANCED_DEFENDER", 250,
            "ELITE_DEFENDER", 500
    );

    private static final int ACTIVITY_STREAK_THRESHOLD = 5;

    private final UserProfileServiceClient userProfileServiceClient;
    private final ConcurrentMap<String, UserProgress> progressByUser = new ConcurrentHashMap<>();

    public GameEngineService(UserProfileServiceClient userProfileServiceClient) {
        this.userProfileServiceClient = userProfileServiceClient;
    }

    public void awardPoints(String userId, String activity, int points) {
        Objects.requireNonNull(userId, "userId must not be null");
        Objects.requireNonNull(activity, "activity must not be null");
        if (points <= 0) {
            LOGGER.debug("Ignoring non-positive point award of {} for user {}", points, userId);
            return;
        }

        int updatedTotal = userProfileServiceClient.updateUserPoints(userId, points);
        UserProgress progress = progressByUser.computeIfAbsent(userId, ignored -> new UserProgress());
        progress.registerActivity(activity, points, updatedTotal);

        List<String> newlyAwardedBadges = progress.evaluateBadges(activity, updatedTotal);
        newlyAwardedBadges.forEach(badge -> userProfileServiceClient.registerBadge(userId, badge));

        if (!newlyAwardedBadges.isEmpty()) {
            LOGGER.info("Awarded badges {} to user {} after activity {}", newlyAwardedBadges, userId, activity);
        }
    }

    private static final class UserProgress {

        private final AtomicInteger lifetimePoints = new AtomicInteger();
        private final ConcurrentMap<String, AtomicInteger> activityCounts = new ConcurrentHashMap<>();
        private final Set<String> awardedBadges = ConcurrentHashMap.newKeySet();
        private final List<ActivityEntry> activityTimeline = Collections.synchronizedList(new ArrayList<>());

        void registerActivity(String activity, int points, int updatedTotal) {
            lifetimePoints.set(updatedTotal);
            activityCounts.computeIfAbsent(activity, ignored -> new AtomicInteger()).incrementAndGet();
            activityTimeline.add(new ActivityEntry(activity, points, Instant.now()));
        }

        List<String> evaluateBadges(String activity, int updatedTotal) {
            List<String> newlyAwarded = new ArrayList<>();

            POINT_BADGE_THRESHOLDS.forEach((badge, threshold) -> {
                if (updatedTotal >= threshold && awardedBadges.add(badge)) {
                    newlyAwarded.add(badge);
                }
            });

            int streakCount = activityCounts.getOrDefault(activity, new AtomicInteger()).get();
            if (streakCount > 0 && streakCount % ACTIVITY_STREAK_THRESHOLD == 0) {
                String badgeCode = normalizedActivityBadge(activity);
                if (awardedBadges.add(badgeCode)) {
                    newlyAwarded.add(badgeCode);
                }
            }

            if (lifetimePoints.get() >= 200 && activityTimeline.size() >= 10) {
                long distinctActivities = activityTimeline.stream()
                        .map(ActivityEntry::activity)
                        .distinct()
                        .count();
                if (distinctActivities >= 5) {
                    String badgeCode = "MULTI_DOMAIN_SPECIALIST";
                    if (awardedBadges.add(badgeCode)) {
                        newlyAwarded.add(badgeCode);
                    }
                }
            }

            return newlyAwarded;
        }

        private String normalizedActivityBadge(String activity) {
            return activity.trim().toUpperCase(Locale.ROOT).replace(' ', '_') + "_MASTER";
        }
    }

    private record ActivityEntry(String activity, int points, Instant occurredAt) {}
}
