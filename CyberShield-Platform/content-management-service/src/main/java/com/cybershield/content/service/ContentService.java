package com.cybershield.content.service;

import com.cybershield.content.model.LearningModule;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ContentService {

    public List<LearningModule> getLearningModules() {
        return List.of(
            new LearningModule("mod-network-basics", "أساسيات الشبكات", "network", 1),
            new LearningModule("mod-appsec-advanced", "أمن التطبيقات المتقدم", "application", 2),
            new LearningModule("mod-incident-response", "الاستجابة للحوادث", "incident-response", 3)
        );
    }
}
