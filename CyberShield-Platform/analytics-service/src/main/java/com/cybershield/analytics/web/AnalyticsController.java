package com.cybershield.analytics.web;

import com.cybershield.analytics.model.UserAnalytics;
import com.cybershield.analytics.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/user/{userId}")
    public UserAnalytics getUserAnalytics(@PathVariable String userId) {
        return analyticsService.getUserAnalytics(userId);
    }
}
