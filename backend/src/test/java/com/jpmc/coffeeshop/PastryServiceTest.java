package com.jpmc.coffeeshop;

import com.jpmc.coffeeshop.exception.ResourceNotFoundException;
import com.jpmc.coffeeshop.model.Product;
import com.jpmc.coffeeshop.repository.ProductRepository;
import com.jpmc.coffeeshop.service.impl.PastryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PastryServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private PastryServiceImpl pastryService;

    private Product butterCroissant;
    private Product blueberryMuffin;
    private Product espressoCoffee;

    @BeforeEach
    void setUp() {
        butterCroissant = new Product(5L, "Butter Croissant", "Pastry", 3.20, true);
        blueberryMuffin = new Product(7L, "Blueberry Muffin", "Pastry", 3.40, true);
        espressoCoffee = new Product(1L, "Espresso", "Coffee", 2.80, true);
    }

    @Nested
    @DisplayName("Feature 1: Retrieve Nut-Free Pastries")
    class RetrieveNutFreePastriesTests {

        @Test
        @DisplayName("Should return matching pastry records when nut-free pastries are available")
        void shouldReturnMatchingPastriesWhenAvailable() {
            when(productRepository.findByCategoryIgnoreCaseAndNutFreeTrue("Pastry"))
                    .thenReturn(List.of(butterCroissant, blueberryMuffin));

            List<Product> result = pastryService.getNutFreePastries();

            assertThat(result).hasSize(2);
            assertThat(result).extracting(Product::getName)
                    .containsExactly("Butter Croissant", "Blueberry Muffin");
            assertThat(result).allMatch(Product::getNutFree);
            assertThat(result).allMatch(p -> "Pastry".equalsIgnoreCase(p.getCategory()));
            verify(productRepository, times(1)).findByCategoryIgnoreCaseAndNutFreeTrue("Pastry");
        }

        @Test
        @DisplayName("Should return empty collection when no nut-free pastries are available")
        void shouldReturnEmptyListWhenNoNutFreePastries() {
            when(productRepository.findByCategoryIgnoreCaseAndNutFreeTrue("Pastry"))
                    .thenReturn(Collections.emptyList());

            List<Product> result = pastryService.getNutFreePastries();

            assertThat(result).isNotNull();
            assertThat(result).isEmpty();
            verify(productRepository, times(1)).findByCategoryIgnoreCaseAndNutFreeTrue("Pastry");
        }
    }

    @Nested
    @DisplayName("Feature 2: Retrieve Pastry by ID")
    class RetrievePastryByIdTests {

        @Test
        @DisplayName("Should return matching pastry when valid pastry ID is provided")
        void shouldReturnPastryWhenValidId() {
            when(productRepository.findById(5L)).thenReturn(Optional.of(butterCroissant));

            Product result = pastryService.getPastryById(5L);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(5L);
            assertThat(result.getName()).isEqualTo("Butter Croissant");
            assertThat(result.getCategory()).isEqualTo("Pastry");
            verify(productRepository, times(1)).findById(5L);
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when pastry ID does not exist")
        void shouldThrowExceptionWhenIdNotFound() {
            when(productRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> pastryService.getPastryById(999L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Pastry with ID 999 not found");

            verify(productRepository, times(1)).findById(999L);
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when ID matches a non-pastry product")
        void shouldThrowExceptionWhenProductIsNotPastry() {
            when(productRepository.findById(1L)).thenReturn(Optional.of(espressoCoffee));

            assertThatThrownBy(() -> pastryService.getPastryById(1L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("is not a pastry");

            verify(productRepository, times(1)).findById(1L);
        }
    }
}
