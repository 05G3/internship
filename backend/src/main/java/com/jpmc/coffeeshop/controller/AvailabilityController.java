package com.jpmc.coffeeshop.controller;

import com.jpmc.coffeeshop.service.AvailabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/availability")
@Tag(name = "Product Availability", description = "Endpoints for managing location-specific product availability")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping
    @Operation(summary = "Get complete product availability matrix by location")
    public ResponseEntity<Map<Long, Map<String, Boolean>>> getAvailabilityMatrix() {
        return ResponseEntity.ok(availabilityService.getAvailabilityMatrix());
    }

    @PutMapping("/{productId}/{location}")
    @Operation(summary = "Update availability for a product at a specific location")
    public ResponseEntity<Map<String, Object>> updateAvailability(
            @PathVariable Long productId,
            @PathVariable String location,
            @RequestBody Map<String, Boolean> body) {
        Boolean available = body.getOrDefault("available", true);
        availabilityService.setAvailability(productId, location, available);
        return ResponseEntity.ok(Map.of(
                "productId", productId,
                "location", location,
                "available", available,
                "message", "Availability updated successfully"
        ));
    }
}
