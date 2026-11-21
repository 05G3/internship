package com.jpmc.coffeeshop.service;

import com.jpmc.coffeeshop.model.Feedback;

import java.util.List;

public interface FeedbackService {
    List<Feedback> getAllFeedback();
    Feedback submitFeedback(Feedback feedback);
}
