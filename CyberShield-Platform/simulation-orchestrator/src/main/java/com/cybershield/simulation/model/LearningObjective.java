package com.cybershield.simulation.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class LearningObjective {

    private String id;
    private Set<String> skills = new HashSet<>();
    private List<String> evaluationCriteria = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Set<String> getSkills() {
        return skills;
    }

    public void setSkills(Set<String> skills) {
        this.skills = skills;
    }

    public List<String> getEvaluationCriteria() {
        return evaluationCriteria;
    }

    public void setEvaluationCriteria(List<String> evaluationCriteria) {
        this.evaluationCriteria = evaluationCriteria;
    }
}
