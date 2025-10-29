package com.cybershield.userprofile.controller;

import com.cybershield.userprofile.domain.UserProfile;
import com.cybershield.userprofile.service.UserProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/{username}")
    public UserProfile getUserProfile(@PathVariable String username) {
        return userProfileService.getUserProfile(username);
    }

    @PutMapping("/{username}")
    public UserProfile updateUserProfile(@PathVariable String username, @RequestBody UserProfile userProfile) {
        return userProfileService.updateUserProfile(username, userProfile);
    }

    @PostMapping("/{username}/points")
    public UserProfile incrementPoints(@PathVariable String username, @RequestBody PointsUpdateRequest request) {
        return userProfileService.incrementPoints(username, request.delta());
    }

    @PostMapping("/{username}/badges")
    public UserProfile registerBadge(@PathVariable String username, @RequestBody BadgeAwardRequest request) {
        return userProfileService.registerBadge(username, request.badge());
    }

    private record PointsUpdateRequest(int delta) {}

    private record BadgeAwardRequest(String badge) {}
}
