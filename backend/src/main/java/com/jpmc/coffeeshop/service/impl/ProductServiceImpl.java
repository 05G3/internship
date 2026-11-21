package com.jpmc.coffeeshop.service.impl;

import com.jpmc.coffeeshop.exception.ResourceNotFoundException;
import com.jpmc.coffeeshop.model.Product;
import com.jpmc.coffeeshop.model.ProductAvailability;
import com.jpmc.coffeeshop.repository.ProductAvailabilityRepository;
import com.jpmc.coffeeshop.repository.ProductRepository;
import com.jpmc.coffeeshop.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductAvailabilityRepository availabilityRepository;

    public ProductServiceImpl(ProductRepository productRepository, ProductAvailabilityRepository availabilityRepository) {
        this.productRepository = productRepository;
        this.availabilityRepository = availabilityRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(String category) {
        if (category == null || category.equalsIgnoreCase("All")) {
            return productRepository.findAll();
        }
        return productRepository.findByCategoryIgnoreCase(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getMenu(String location, String category, Boolean nutFreeOnly) {
        List<Product> products = productRepository.findAll();

        if (location != null && !location.isBlank()) {
            Set<Long> availableProductIds = availabilityRepository
                    .findByLocationIgnoreCaseAndAvailableTrue(location)
                    .stream()
                    .map(ProductAvailability::getProductId)
                    .collect(Collectors.toSet());

            products = products.stream()
                    .filter(p -> availableProductIds.contains(p.getId()))
                    .collect(Collectors.toList());
        }

        if (category != null && !category.equalsIgnoreCase("All") && !category.isBlank()) {
            products = products.stream()
                    .filter(p -> p.getCategory().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        if (Boolean.TRUE.equals(nutFreeOnly)) {
            products = products.stream()
                    .filter(p -> !"Pastry".equalsIgnoreCase(p.getCategory()) || Boolean.TRUE.equals(p.getNutFree()))
                    .collect(Collectors.toList());
        }

        return products;
    }

    @Override
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + id + " not found"));
    }

    @Override
    public Product createProduct(Product product) {
        if (product.getNutFree() == null) {
            product.setNutFree(true);
        }
        if (product.getFoodType() == null || product.getFoodType().isBlank()) {
            product.setFoodType("VEG");
        }
        if (product.getAvailable() == null) {
            product.setAvailable(true);
        }
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = getProductById(id);
        existing.setName(updatedProduct.getName());
        existing.setCategory(updatedProduct.getCategory());
        if (updatedProduct.getSubcategory() != null) {
            existing.setSubcategory(updatedProduct.getSubcategory());
        }
        if (updatedProduct.getDescription() != null) {
            existing.setDescription(updatedProduct.getDescription());
        }
        existing.setPrice(updatedProduct.getPrice());
        if (updatedProduct.getFoodType() != null) {
            existing.setFoodType(updatedProduct.getFoodType());
        }
        if (updatedProduct.getNutFree() != null) {
            existing.setNutFree(updatedProduct.getNutFree());
        }
        if (updatedProduct.getImageUrl() != null) {
            existing.setImageUrl(updatedProduct.getImageUrl());
        }
        if (updatedProduct.getAvailable() != null) {
            existing.setAvailable(updatedProduct.getAvailable());
        }
        return productRepository.save(existing);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product with ID " + id + " not found");
        }
        productRepository.deleteById(id);
    }
}
