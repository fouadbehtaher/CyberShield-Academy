package com.cybershield.simulation.model.advanced;

import com.cybershield.simulation.model.DifficultyLevel;

public class DefenseMechanism {

    private String id;
    private DifficultyLevel difficulty;
    private String description;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
