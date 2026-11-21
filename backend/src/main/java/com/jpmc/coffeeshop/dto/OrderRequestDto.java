package com.jpmc.coffeeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class OrderRequestDto {

    private String customer;

    @NotBlank(message = "Location is required")
    private String location;

    @NotEmpty(message = "Cart cannot be empty")
    private List<Long> productIds;

    private String customerEmail;
    private String customerPhone;
    private String paymentMethod;
    private String paymentStatus;

    public OrderRequestDto() {
    }

    public OrderRequestDto(String customer, String location, List<Long> productIds) {
        this.customer = customer;
        this.location = location;
        this.productIds = productIds;
    }

    public OrderRequestDto(String customer, String location, List<Long> productIds,
                           String customerEmail, String customerPhone, String paymentMethod, String paymentStatus) {
        this.customer = customer;
        this.location = location;
        this.productIds = productIds;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
    }

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
