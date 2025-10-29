package com.cybershield.simulation.repositories;

import com.cybershield.simulation.model.DifficultyLevel;
import com.cybershield.simulation.model.advanced.AttackVector;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class AttackVectorLibrary {

    private final List<AttackVector> vectors = new ArrayList<>();

    public AttackVectorLibrary() {
        AttackVector phishing = new AttackVector();
        phishing.setId("phishing-basic");
        phishing.setDifficulty(DifficultyLevel.BEGINNER);
        phishing.setComplexity(0.3);
        phishing.setTargetSkill("social-engineering");
        vectors.add(phishing);

        AttackVector ransomware = new AttackVector();
        ransomware.setId("ransomware");
        ransomware.setDifficulty(DifficultyLevel.INTERMEDIATE);
        ransomware.setComplexity(0.6);
        ransomware.setTargetSkill("incident-response");
        vectors.add(ransomware);
    }

    public List<AttackVector> getVectors() {
        return vectors;
    }
}
