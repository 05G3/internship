package com.jpmc.coffeeshop.service.impl;

import com.jpmc.coffeeshop.exception.ResourceNotFoundException;
import com.jpmc.coffeeshop.model.Product;
import com.jpmc.coffeeshop.repository.ProductRepository;
import com.jpmc.coffeeshop.service.PastryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class PastryServiceImpl implements PastryService {

    private final ProductRepository productRepository;

    public PastryServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getNutFreePastries() {
        List<Product> list = new ArrayList<>(productRepository.findByCategoryIgnoreCaseAndNutFreeTrue("Pastry"));
        List<Product> pluralList = productRepository.findByCategoryIgnoreCaseAndNutFreeTrue("Pastries");
        for (Product p : pluralList) {
            if (!list.contains(p)) {
                list.add(p);
            }
        }
        return list;
    }

    @Override
    public Product getPastryById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pastry with ID " + id + " not found"));

        if (!"Pastry".equalsIgnoreCase(product.getCategory()) && !"Pastries".equalsIgnoreCase(product.getCategory())) {
            throw new ResourceNotFoundException("Product with ID " + id + " is not a pastry (Category: " + product.getCategory() + ")");
        }

        return product;
    }
}
