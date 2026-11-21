package com.jpmc.coffeeshop.controller;

import com.jpmc.coffeeshop.dto.OrderRequestDto;
import com.jpmc.coffeeshop.model.Order;
import com.jpmc.coffeeshop.repository.OrderRepository;
import com.jpmc.coffeeshop.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Endpoints for customer order placement and admin order status management")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    @Operation(summary = "Get all orders with optional filtering by location or customer email")
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String customerEmail,
            @RequestParam(required = false) String status) {
        List<Order> orders;
        if (customerEmail != null && !customerEmail.isBlank()) {
            orders = orderRepository.findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(customerEmail.trim());
        } else if (location != null && !location.isBlank() && !location.equalsIgnoreCase("All")) {
            orders = orderRepository.findByLocationIgnoreCase(location.trim());
        } else {
            orders = orderService.getAllOrders();
        }

        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("All")) {
            String norm = status.trim().toUpperCase().replace(" ", "_");
            orders = orders.stream()
                    .filter(o -> o.getStatus().equalsIgnoreCase(norm) || o.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping
    @Operation(summary = "Place a new customer order")
    public ResponseEntity<Order> placeOrder(@Valid @RequestBody OrderRequestDto request) {
        Order placed = orderService.placeOrder(request);
        return new ResponseEntity<>(placed, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update order status (PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED)")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status field is required");
        }
        Order updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
