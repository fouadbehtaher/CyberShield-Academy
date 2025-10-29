package com.cybershield.simulation.repositories;

import com.cybershield.simulation.model.DifficultyLevel;
import com.cybershield.simulation.model.advanced.DefenseMechanism;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class DefenseMechanismLibrary {

    private final List<DefenseMechanism> mechanisms = new ArrayList<>();

    public DefenseMechanismLibrary() {
        DefenseMechanism firewall = new DefenseMechanism();
        firewall.setId("firewall-tuning");
        firewall.setDifficulty(DifficultyLevel.BEGINNER);
        firewall.setDescription("Configure firewall rules for perimeter security");
        mechanisms.add(firewall);

        DefenseMechanism threatHunting = new DefenseMechanism();
        threatHunting.setId("threat-hunting");
        threatHunting.setDifficulty(DifficultyLevel.INTERMEDIATE);
        threatHunting.setDescription("Perform hunting for suspicious behaviors");
        mechanisms.add(threatHunting);
    }

    public List<DefenseMechanism> getMechanisms() {
        return mechanisms;
    }
}
