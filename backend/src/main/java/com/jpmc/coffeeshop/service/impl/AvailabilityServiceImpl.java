package com.jpmc.coffeeshop.service.impl;

import com.jpmc.coffeeshop.model.Product;
import com.jpmc.coffeeshop.model.ProductAvailability;
import com.jpmc.coffeeshop.repository.ProductAvailabilityRepository;
import com.jpmc.coffeeshop.repository.ProductRepository;
import com.jpmc.coffeeshop.service.AvailabilityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class AvailabilityServiceImpl implements AvailabilityService {

    private final ProductAvailabilityRepository availabilityRepository;
    private final ProductRepository productRepository;
    private static final List<String> LOCATIONS = List.of(
            "Hyderabad", "Vijayawada", "Rajahmundry",
            "Downtown", "Airport", "Campus"
    );

    public AvailabilityServiceImpl(ProductAvailabilityRepository availabilityRepository, ProductRepository productRepository) {
        this.availabilityRepository = availabilityRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Long, Map<String, Boolean>> getAvailabilityMatrix() {
        Map<Long, Map<String, Boolean>> matrix = new HashMap<>();
        List<Product> products = productRepository.findAll();
        List<ProductAvailability> allAvail = availabilityRepository.findAll();

        for (Product p : products) {
            Map<String, Boolean> locMap = new HashMap<>();
            for (String loc : LOCATIONS) {
                locMap.put(loc, false);
            }
            matrix.put(p.getId(), locMap);
        }

        for (ProductAvailability pa : allAvail) {
            if (matrix.containsKey(pa.getProductId())) {
                matrix.get(pa.getProductId()).put(pa.getLocation(), pa.getAvailable());
            } else {
                Map<String, Boolean> locMap = new HashMap<>();
                for (String loc : LOCATIONS) {
                    locMap.put(loc, false);
                }
                locMap.put(pa.getLocation(), pa.getAvailable());
                matrix.put(pa.getProductId(), locMap);
            }
        }

        return matrix;
    }

    @Override
    public void setAvailability(Long productId, String location, Boolean available) {
        Optional<ProductAvailability> existing = availabilityRepository.findByProductIdAndLocationIgnoreCase(productId, location);
        ProductAvailability pa;
        if (existing.isPresent()) {
            pa = existing.get();
            pa.setAvailable(available);
        } else {
            pa = new ProductAvailability(productId, location, available);
        }
        availabilityRepository.save(pa);
    }
}
