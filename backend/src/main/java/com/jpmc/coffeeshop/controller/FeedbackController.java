package com.jpmc.coffeeshop.controller;

import com.jpmc.coffeeshop.model.Feedback;
import com.jpmc.coffeeshop.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@Tag(name = "Customer Feedback", description = "Endpoints for submitting and retrieving customer reviews and ratings")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping
    @Operation(summary = "Get all customer feedback")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    @PostMapping
    @Operation(summary = "Submit new customer feedback")
    public ResponseEntity<Feedback> submitFeedback(@Valid @RequestBody Feedback feedback) {
        Feedback saved = feedbackService.submitFeedback(feedback);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
