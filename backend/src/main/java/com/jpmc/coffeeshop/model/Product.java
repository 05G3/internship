package com.jpmc.coffeeshop.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category; // "Drinks", "Milkshakes", "Sandwiches", "Pastries", "Coffee", "Pastry"

    @Column(name = "subcategory")
    private String subcategory; // "Coffee", "Tea", or specific subcategory

    @Column(name = "description", length = 1000)
    private String description = "";

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be non-negative")
    @Column(nullable = false)
    private Double price;

    @Column(name = "food_type")
    private String foodType = "VEG"; // "VEG" or "NON_VEG"

    @NotNull(message = "Nut-free indicator is required")
    @Column(name = "nut_free", nullable = false)
    private Boolean nutFree = true;

    @Column(name = "image_url", length = 1000)
    private String imageUrl = "";

    @Column(name = "available", nullable = false)
    private Boolean available = true;

    public Product() {
    }

    public Product(Long id, String name, String category, Double price, Boolean nutFree) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.nutFree = nutFree;
        this.available = true;
        this.foodType = "VEG";
    }

    public Product(Long id, String name, String category, String subcategory, String description,
                   Double price, String foodType, Boolean nutFree, String imageUrl, Boolean available) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.subcategory = subcategory;
        this.description = description;
        this.price = price;
        this.foodType = foodType != null ? foodType : "VEG";
        this.nutFree = nutFree != null ? nutFree : true;
        this.imageUrl = imageUrl != null ? imageUrl : "";
        this.available = available != null ? available : true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getFoodType() {
        return foodType != null ? foodType : "VEG";
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public Boolean getNutFree() {
        return nutFree;
    }

    public void setNutFree(Boolean nutFree) {
        this.nutFree = nutFree;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getAvailable() {
        return available != null ? available : true;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
