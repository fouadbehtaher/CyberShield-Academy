package com.cybershield.userprofile.service;

import com.cybershield.userprofile.domain.UserProfile;
import com.cybershield.userprofile.repository.UserProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.Locale;
import java.util.Objects;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfile getUserProfile(String username) {
        return userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User profile not found for username: " + username));
    }

    public UserProfile updateUserProfile(String username, UserProfile updatedProfile) {
        UserProfile existingProfile = getUserProfile(username);

        existingProfile.setEmail(updatedProfile.getEmail());
        existingProfile.setFirstName(updatedProfile.getFirstName());
        existingProfile.setLastName(updatedProfile.getLastName());
        existingProfile.setSkills(updatedProfile.getSkills());
        existingProfile.setCompletedModules(updatedProfile.getCompletedModules());
        existingProfile.setPoints(updatedProfile.getPoints());
        existingProfile.setBadges(updatedProfile.getBadges());

        return userProfileRepository.save(existingProfile);
    }

    public UserProfile incrementPoints(String username, int delta) {
        Objects.requireNonNull(username, "username must not be null");
        UserProfile profile = getUserProfile(username);
        profile.setPoints(profile.getPoints() + delta);
        return userProfileRepository.save(profile);
    }

    public UserProfile registerBadge(String username, String badgeCode) {
        Objects.requireNonNull(username, "username must not be null");
        Objects.requireNonNull(badgeCode, "badgeCode must not be null");

        UserProfile profile = getUserProfile(username);
        profile.getBadges().add(badgeCode.trim().toUpperCase(Locale.ROOT));
        return userProfileRepository.save(profile);
    }
}
