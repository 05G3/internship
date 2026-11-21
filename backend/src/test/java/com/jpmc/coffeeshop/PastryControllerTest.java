package com.jpmc.coffeeshop;

import com.jpmc.coffeeshop.controller.PastryController;
import com.jpmc.coffeeshop.exception.GlobalExceptionHandler;
import com.jpmc.coffeeshop.exception.ResourceNotFoundException;
import com.jpmc.coffeeshop.model.Product;
import com.jpmc.coffeeshop.service.PastryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PastryControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PastryService pastryService;

    @InjectMocks
    private PastryController pastryController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(pastryController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/pastries/nut-free returns 200 OK with list of nut-free pastries")
    void testGetNutFreePastries() throws Exception {
        Product p1 = new Product(5L, "Butter Croissant", "Pastry", 3.20, true);
        Product p2 = new Product(7L, "Blueberry Muffin", "Pastry", 3.40, true);

        when(pastryService.getNutFreePastries()).thenReturn(List.of(p1, p2));

        mockMvc.perform(get("/api/pastries/nut-free")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Butter Croissant")))
                .andExpect(jsonPath("$[0].nutFree", is(true)))
                .andExpect(jsonPath("$[1].name", is("Blueberry Muffin")))
                .andExpect(jsonPath("$[1].nutFree", is(true)));
    }

    @Test
    @DisplayName("GET /api/pastries/nut-free returns 200 OK with empty array when none found")
    void testGetNutFreePastriesEmpty() throws Exception {
        when(pastryService.getNutFreePastries()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/pastries/nut-free")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("GET /api/pastries/{id} returns 200 OK with pastry details when valid ID")
    void testGetPastryByIdSuccess() throws Exception {
        Product p = new Product(5L, "Butter Croissant", "Pastry", 3.20, true);
        when(pastryService.getPastryById(5L)).thenReturn(p);

        mockMvc.perform(get("/api/pastries/5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(5)))
                .andExpect(jsonPath("$.name", is("Butter Croissant")))
                .andExpect(jsonPath("$.category", is("Pastry")))
                .andExpect(jsonPath("$.price", is(3.20)))
                .andExpect(jsonPath("$.nutFree", is(true)));
    }

    @Test
    @DisplayName("GET /api/pastries/{id} returns 404 Not Found when ID does not exist")
    void testGetPastryByIdNotFound() throws Exception {
        when(pastryService.getPastryById(999L))
                .thenThrow(new ResourceNotFoundException("Pastry with ID 999 not found"));

        mockMvc.perform(get("/api/pastries/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.message", is("Pastry with ID 999 not found")));
    }
}
