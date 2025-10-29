package com.cybershield.content.web;

import com.cybershield.content.model.LearningModule;
import com.cybershield.content.service.ContentService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/modules")
    public List<LearningModule> getLearningModules() {
        return contentService.getLearningModules();
    }
}
