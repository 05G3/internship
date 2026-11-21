package com.jpmc.coffeeshop.repository;

import com.jpmc.coffeeshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByCategoryIgnoreCaseAndNutFreeTrue(String category);

    List<Product> findByNutFreeTrue();
}
