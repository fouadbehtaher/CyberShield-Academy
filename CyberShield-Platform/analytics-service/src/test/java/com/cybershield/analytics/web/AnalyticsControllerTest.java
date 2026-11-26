package com.cybershield.analytics.web;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.cybershield.analytics.model.UserAnalytics;
import com.cybershield.analytics.service.AnalyticsService;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class AnalyticsControllerTest {

    @Test
    void returnsTheSnapshotForAUser() throws Exception {
        AnalyticsService service = mock(AnalyticsService.class);
        when(service.getUserAnalytics("u1")).thenReturn(
            new UserAnalytics("u1", Instant.parse("2026-01-01T00:00:00Z"), Map.of("events.total", 3L), List.of("x")));
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new AnalyticsController(service)).build();

        mvc.perform(get("/api/analytics/user/u1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.userId").value("u1"))
            .andExpect(jsonPath("$.aggregatedMetrics['events.total']").value(3))
            .andExpect(jsonPath("$.recommendedActions[0]").value("x"));
    }
}
