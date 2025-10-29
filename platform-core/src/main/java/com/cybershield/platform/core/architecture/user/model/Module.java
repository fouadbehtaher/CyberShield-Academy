package com.cybershield.platform.core.architecture.user.model;

import java.util.Set;

public class Module {

    private final String id;
    private final Set<Skill> grantedSkills;

    public Module(String id, Set<Skill> grantedSkills) {
        this.id = id;
        this.grantedSkills = grantedSkills;
    }

    public String getId() {
        return id;
    }

    public Set<Skill> getGrantedSkills() {
        return grantedSkills;
    }
}
