package com.jpmc.coffeeshop;

import com.jpmc.coffeeshop.dto.OrderRequestDto;
import com.jpmc.coffeeshop.exception.ResourceNotFoundException;
import com.jpmc.coffeeshop.model.Order;
import com.jpmc.coffeeshop.model.Product;
import com.jpmc.coffeeshop.model.User;
import com.jpmc.coffeeshop.repository.OrderRepository;
import com.jpmc.coffeeshop.repository.ProductAvailabilityRepository;
import com.jpmc.coffeeshop.repository.ProductRepository;
import com.jpmc.coffeeshop.repository.UserRepository;
import com.jpmc.coffeeshop.service.impl.AvailabilityServiceImpl;
import com.jpmc.coffeeshop.service.impl.OrderServiceImpl;
import com.jpmc.coffeeshop.service.impl.ProductServiceImpl;
import com.jpmc.coffeeshop.service.impl.UserServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExtendedServicesTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductAvailabilityRepository availabilityRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @InjectMocks
    private UserServiceImpl userService;

    @InjectMocks
    private OrderServiceImpl orderService;

    @InjectMocks
    private AvailabilityServiceImpl availabilityService;

    @Test
    @DisplayName("ProductService: Update product attributes successfully")
    void testProductUpdate() {
        Product existing = new Product(1L, "Latte", "Coffee", 4.0, true);
        Product updatedData = new Product(null, "Vanilla Latte", "Coffee", 4.5, true);

        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        Product result = productService.updateProduct(1L, updatedData);

        assertThat(result.getName()).isEqualTo("Vanilla Latte");
        assertThat(result.getPrice()).isEqualTo(4.5);
    }

    @Test
    @DisplayName("UserService: Create and fetch users")
    void testUserCreationAndFetch() {
        User user = new User(1L, "Asha Rao", "asha@brew.co", "ADMIN");
        when(userRepository.findAll()).thenReturn(List.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User created = userService.createUser(user);
        assertThat(created.getEmail()).isEqualTo("asha@brew.co");

        List<User> users = userService.getAllUsers();
        assertThat(users).hasSize(1);
    }

    @Test
    @DisplayName("OrderService: Place order calculates total properly")
    void testOrderPlacement() {
        Product latte = new Product(2L, "Latte", "Coffee", 4.20, true);
        Product croissant = new Product(5L, "Butter Croissant", "Pastry", 3.20, true);

        when(productRepository.findById(2L)).thenReturn(Optional.of(latte));
        when(productRepository.findById(5L)).thenReturn(Optional.of(croissant));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        OrderRequestDto dto = new OrderRequestDto("Alex", "Downtown", List.of(2L, 5L));
        Order order = orderService.placeOrder(dto);

        assertThat(order.getCustomer()).isEqualTo("Alex");
        assertThat(order.getLocation()).isEqualTo("Downtown");
        assertThat(order.getTotal()).isEqualTo(7.40);
        assertThat(order.getItems()).hasSize(2);
        assertThat(order.getStatus()).isEqualTo("PENDING");
    }

    @Test
    @DisplayName("OrderService: Status update accepts valid status, rejects invalid")
    void testOrderStatusUpdate() {
        Order order = new Order(1L, "Alex", "Downtown", 7.40, "PENDING");
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        Order updated = orderService.updateOrderStatus(1L, "COMPLETED");
        assertThat(updated.getStatus()).isEqualTo("COMPLETED");

        assertThatThrownBy(() -> orderService.updateOrderStatus(1L, "INVALID_STATUS"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid order status");
    }

    @Test
    @DisplayName("AvailabilityService: Matrix returns mapping for products and locations")
    void testAvailabilityMatrix() {
        Product p = new Product(1L, "Espresso", "Coffee", 2.8, true);
        when(productRepository.findAll()).thenReturn(List.of(p));
        when(availabilityRepository.findAll()).thenReturn(List.of());

        Map<Long, Map<String, Boolean>> matrix = availabilityService.getAvailabilityMatrix();

        assertThat(matrix).containsKey(1L);
        assertThat(matrix.get(1L)).containsKeys("Downtown", "Airport", "Campus");
    }
}
