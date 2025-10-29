package com.cybershield.cyberrange.web;

import com.cybershield.cyberrange.service.CyberRangeService;
import com.cybershield.cyberrange.service.dto.CyberRangeProvisionRequest;
import com.cybershield.cyberrange.service.dto.CyberRangeStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/cyber-range/environments")
public class CyberRangeController {

    private final CyberRangeService cyberRangeService;

    public CyberRangeController(CyberRangeService cyberRangeService) {
        this.cyberRangeService = cyberRangeService;
    }

    @PostMapping
    public CompletableFuture<ResponseEntity<CyberRangeStatus>> provisionEnvironment(
        @RequestBody CyberRangeProvisionRequest request
    ) {
        return cyberRangeService.provisionEnvironment(request)
            .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/{environmentId}")
    public ResponseEntity<CyberRangeStatus> getEnvironmentStatus(@PathVariable String environmentId) {
        return cyberRangeService.getEnvironmentStatus(environmentId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{environmentId}")
    public ResponseEntity<Map<String, Object>> destroyEnvironment(@PathVariable String environmentId) {
        boolean deleted = cyberRangeService.destroyEnvironment(environmentId);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of(
            "environmentId", environmentId,
            "deleted", true
        ));
    }
}
