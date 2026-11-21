package com.jpmc.coffeeshop.service;

import com.jpmc.coffeeshop.model.Product;

import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    List<Product> getProductsByCategory(String category);
    List<Product> getMenu(String location, String category, Boolean nutFreeOnly);
    Product getProductById(Long id);
    Product createProduct(Product product);
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
}
