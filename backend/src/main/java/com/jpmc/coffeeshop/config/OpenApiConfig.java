package com.jpmc.coffeeshop.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI coffeeShopOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Brew & Co. Coffee Shop API")
                        .description("JPMorganChase SSI Challenge – Full-Stack Coffee Shop Application REST API documentation.\n" +
                                "Covers customer ordering, nut-free pastry retrieval, product management, and administrative services.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("JPMC SSI Challenge Team")
                                .email("internship@jpmchase.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")));
    }
}
