package com.cybershield.platform.core.architecture.user.events;

import com.cybershield.platform.core.architecture.user.model.Skill;
import com.cybershield.platform.core.architecture.user.model.UserProfile;
import java.util.Set;

public class UserCreatedEvent {

    private final String userId;
    private final UserProfile profile;
    private final Set<Skill> initialSkills;

    public UserCreatedEvent(String userId, UserProfile profile, Set<Skill> initialSkills) {
        this.userId = userId;
        this.profile = profile;
        this.initialSkills = initialSkills;
    }

    public String getUserId() {
        return userId;
    }

    public UserProfile getProfile() {
        return profile;
    }

    public Set<Skill> getInitialSkills() {
        return initialSkills;
    }
}
