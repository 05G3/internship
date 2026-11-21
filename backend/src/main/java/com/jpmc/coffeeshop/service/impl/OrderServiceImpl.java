package com.jpmc.coffeeshop.service.impl;

import com.jpmc.coffeeshop.dto.OrderRequestDto;
import com.jpmc.coffeeshop.exception.ResourceNotFoundException;
import com.jpmc.coffeeshop.model.Order;
import com.jpmc.coffeeshop.model.OrderItem;
import com.jpmc.coffeeshop.model.Product;
import com.jpmc.coffeeshop.repository.OrderRepository;
import com.jpmc.coffeeshop.repository.ProductRepository;
import com.jpmc.coffeeshop.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    private static final Set<String> VALID_STATUSES = Set.of(
            "PENDING", "CONFIRMED", "PREPARING", "READY", "READY_FOR_PICKUP", "COMPLETED", "CANCELLED"
    );

    public OrderServiceImpl(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + id + " not found"));
    }

    @Override
    public Order placeOrder(OrderRequestDto request) {
        String customerName = (request.getCustomer() == null || request.getCustomer().isBlank())
                ? "Guest"
                : request.getCustomer().trim();

        Order order = new Order();
        order.setCustomer(customerName);
        order.setCustomerEmail(request.getCustomerEmail() != null ? request.getCustomerEmail().trim() : "");
        order.setCustomerPhone(request.getCustomerPhone() != null ? request.getCustomerPhone().trim() : "");
        order.setLocation(request.getLocation());
        order.setStatus("PENDING");
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI");
        order.setPaymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "PAID");
        order.setCreatedAt(LocalDateTime.now());

        // Group counts by product ID to support multiple quantities
        Map<Long, Integer> counts = new LinkedHashMap<>();
        for (Long productId : request.getProductIds()) {
            counts.put(productId, counts.getOrDefault(productId, 0) + 1);
        }

        double total = 0.0;
        for (Map.Entry<Long, Integer> entry : counts.entrySet()) {
            Long productId = entry.getKey();
            int qty = entry.getValue();
            Product p = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + productId + " not found"));
            OrderItem item = new OrderItem(p.getName(), p.getPrice(), qty);
            order.addItem(item);
            total += (p.getPrice() * qty);
        }

        // Round to 2 decimal places
        BigDecimal bd = BigDecimal.valueOf(total).setScale(2, RoundingMode.HALF_UP);
        order.setTotal(bd.doubleValue());

        return orderRepository.save(order);
    }

    @Override
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        String upperStatus = status.trim().toUpperCase().replace(" ", "_");
        if (upperStatus.equals("READY_FOR_PICKUP") || upperStatus.equals("READYFORPICKUP")) {
            upperStatus = "READY";
        }
        if (!VALID_STATUSES.contains(upperStatus)) {
            throw new IllegalArgumentException("Invalid order status: " + status + ". Allowed: PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED");
        }
        order.setStatus(upperStatus);
        return orderRepository.save(order);
    }
}
