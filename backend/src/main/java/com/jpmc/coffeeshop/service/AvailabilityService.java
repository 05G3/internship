package com.jpmc.coffeeshop.service;

import java.util.Map;

public interface AvailabilityService {
    Map<Long, Map<String, Boolean>> getAvailabilityMatrix();
    void setAvailability(Long productId, String location, Boolean available);
}
