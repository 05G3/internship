package com.jpmc.coffeeshop.repository;

import com.jpmc.coffeeshop.model.ProductAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductAvailabilityRepository extends JpaRepository<ProductAvailability, Long> {
    Optional<ProductAvailability> findByProductIdAndLocationIgnoreCase(Long productId, String location);
    List<ProductAvailability> findByProductId(Long productId);
    List<ProductAvailability> findByLocationIgnoreCaseAndAvailableTrue(String location);
}
