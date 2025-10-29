package com.cybershield.simulation.model.advanced;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class SimulationComponent {

    private String name;
    private String type;
    private String image;
    private Map<String, String> env = new HashMap<>();
    private Map<String, Map<String, String>> resources = new HashMap<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Map<String, String> getEnv() {
        return Collections.unmodifiableMap(env);
    }

    public void setEnv(Map<String, String> env) {
        this.env = new HashMap<>(env);
    }

    public Map<String, Map<String, String>> getResources() {
        return Collections.unmodifiableMap(resources);
    }

    public void setResources(Map<String, Map<String, String>> resources) {
        this.resources = new HashMap<>(resources);
    }
}
