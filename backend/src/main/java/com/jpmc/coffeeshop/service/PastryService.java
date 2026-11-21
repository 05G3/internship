package com.jpmc.coffeeshop.service;

import com.jpmc.coffeeshop.model.Product;

import java.util.List;

public interface PastryService {
    /**
     * Retrieves all pastries that satisfy the nut-free condition.
     * If no matching pastries are found, returns an empty list.
     *
     * @return List of nut-free pastries
     */
    List<Product> getNutFreePastries();

    /**
     * Retrieves a specific pastry by its unique identifier.
     * Throws ResourceNotFoundException if the pastry does not exist or is not a pastry.
     *
     * @param id Pastry ID
     * @return The matching pastry Product
     */
    Product getPastryById(Long id);
}
