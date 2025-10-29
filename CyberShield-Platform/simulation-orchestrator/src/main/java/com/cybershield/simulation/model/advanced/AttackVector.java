package com.cybershield.simulation.model.advanced;

import com.cybershield.simulation.model.DifficultyLevel;

public class AttackVector {

    private String id;
    private DifficultyLevel difficulty;
    private double complexity;
    private String targetSkill;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public double getComplexity() {
        return complexity;
    }

    public void setComplexity(double complexity) {
        this.complexity = complexity;
    }

    public String getTargetSkill() {
        return targetSkill;
    }

    public void setTargetSkill(String targetSkill) {
        this.targetSkill = targetSkill;
    }
}
