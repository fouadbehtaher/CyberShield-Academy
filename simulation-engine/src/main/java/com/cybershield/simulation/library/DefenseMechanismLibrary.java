package com.cybershield.simulation.library;

import com.cybershield.simulation.model.DefenseMechanism;
import com.cybershield.simulation.model.MLGeneratedScenario;
import com.cybershield.simulation.model.MLGeneratedScenario.DefensePattern;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class DefenseMechanismLibrary {

    public DefenseMechanism materializeDefense(DefensePattern pattern, Map<String, Double> contextSignals) {
        DefenseMechanism defense = new DefenseMechanism();
        defense.setName(pattern.getIdentifier());
        defense.setActivationTrigger(contextSignals.isEmpty() ? "baseline" : "adaptive");
        defense.setParameters(pattern.getParameters());
        return defense;
    }
}
