package com.jpmc.coffeeshop.repository;

import com.jpmc.coffeeshop.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderByCreatedAtDesc();
    List<Order> findByLocationIgnoreCase(String location);
    List<Order> findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(String customerEmail);
    List<Order> findByCustomerIgnoreCaseOrderByCreatedAtDesc(String customer);
}
