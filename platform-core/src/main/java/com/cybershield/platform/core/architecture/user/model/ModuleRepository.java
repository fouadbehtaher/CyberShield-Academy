package com.cybershield.platform.core.architecture.user.model;

import java.util.Optional;

public interface ModuleRepository {
    Optional<Module> findById(String moduleId);
}
