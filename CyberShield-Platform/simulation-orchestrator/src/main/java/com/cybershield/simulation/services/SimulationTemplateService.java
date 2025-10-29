package com.cybershield.simulation.services;

import com.cybershield.simulation.model.advanced.ScenarioTemplate;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class SimulationTemplateService {

    private final Map<String, ScenarioTemplate> templates = new HashMap<>();

    public SimulationTemplateService() {
        templates.put("DEFAULT", new ScenarioTemplate());
    }

    public Map<String, ScenarioTemplate> getTemplates() {
        return Collections.unmodifiableMap(templates);
    }
}
