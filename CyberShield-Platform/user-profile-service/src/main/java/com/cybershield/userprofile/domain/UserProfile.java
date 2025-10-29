package com.cybershield.userprofile.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    private String firstName;
    private String lastName;
    private int points;

    @ElementCollection
    @CollectionTable(name = "user_profile_skills", joinColumns = @JoinColumn(name = "user_profile_id"))
    @MapKeyColumn(name = "skill_name")
    @Column(name = "skill_level")
    private Map<String, Integer> skills = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "user_profile_completed_modules", joinColumns = @JoinColumn(name = "user_profile_id"))
    @Column(name = "module_id")
    private List<String> completedModules = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_profile_badges", joinColumns = @JoinColumn(name = "user_profile_id"))
    @Column(name = "badge_code")
    private Set<String> badges = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Map<String, Integer> getSkills() {
        return skills;
    }

    public void setSkills(Map<String, Integer> skills) {
        this.skills = skills == null ? new HashMap<>() : new HashMap<>(skills);
    }

    public List<String> getCompletedModules() {
        return completedModules;
    }

    public void setCompletedModules(List<String> completedModules) {
        this.completedModules = completedModules == null ? new ArrayList<>() : new ArrayList<>(completedModules);
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = Math.max(0, points);
    }

    public Set<String> getBadges() {
        return badges;
    }

    public void setBadges(Set<String> badges) {
        this.badges = badges == null ? new HashSet<>() : new HashSet<>(badges);
    }
}
