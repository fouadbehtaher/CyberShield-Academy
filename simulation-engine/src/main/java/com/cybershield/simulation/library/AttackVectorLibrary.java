package com.cybershield.simulation.library;

import com.cybershield.simulation.model.TargetSystem;
import com.cybershield.simulation.model.TargetSystemBlueprint;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class AttackVectorLibrary {

    public TargetSystem materializeTargetSystem(TargetSystemBlueprint blueprint) {
        TargetSystem target = new TargetSystem();
        target.setName(blueprint.getName());
        target.setDescription("Auto-generated target from blueprint");
        target.setCapabilities(List.of("service-enumeration", "vulnerability-exploitation"));
        target.setMetadata(Map.of(
                "image", blueprint.getImage(),
                "ports", blueprint.getPorts(),
                "labels", blueprint.getLabels()));
        return target;
    }
}
