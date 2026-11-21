package com.jpmc.coffeeshop.controller;

import com.jpmc.coffeeshop.model.Product;
import com.jpmc.coffeeshop.service.PastryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pastries")
@Tag(name = "Pastries", description = "Endpoints for retrieving pastry information and filtering nut-free options")
public class PastryController {

    private final PastryService pastryService;

    public PastryController(PastryService pastryService) {
        this.pastryService = pastryService;
    }

    /**
     * Feature 1: Retrieve nut-free pastries
     * Returns matching pastry records when available, or an empty collection.
     */
    @GetMapping("/nut-free")
    @Operation(summary = "Retrieve nut-free pastries", description = "Filters the pastry catalog and returns only nut-free pastries")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved nut-free pastries")
    public ResponseEntity<List<Product>> getNutFreePastries() {
        List<Product> nutFreePastries = pastryService.getNutFreePastries();
        return ResponseEntity.ok(nutFreePastries);
    }

    /**
     * Feature 2: Retrieve a pastry by ID
     * Returns matching pastry when exists, or 404 when missing.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Retrieve a pastry by ID", description = "Fetches a single pastry by its unique identifier")
    @ApiResponse(responseCode = "200", description = "Pastry found and returned")
    @ApiResponse(responseCode = "404", description = "Pastry with specified ID not found")
    public ResponseEntity<Product> getPastryById(
            @Parameter(description = "Unique ID of the pastry", example = "5")
            @PathVariable Long id) {
        Product pastry = pastryService.getPastryById(id);
        return ResponseEntity.ok(pastry);
    }
}
