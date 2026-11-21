package com.jpmc.coffeeshop.service;

import com.jpmc.coffeeshop.dto.OrderRequestDto;
import com.jpmc.coffeeshop.model.Order;

import java.util.List;

public interface OrderService {
    List<Order> getAllOrders();
    Order getOrderById(Long id);
    Order placeOrder(OrderRequestDto request);
    Order updateOrderStatus(Long id, String status);
}
