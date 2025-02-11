package com.oldri.laptopinventory.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.tags.Tag;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Laptop Inventory API")
                        .version("1.0.0")
                        .description("API documentation for Laptop Inventory Management")
                        .contact(new Contact()
                                .name("Support Team")
                                .email("support@laptopinventory.com")
                                .url("https://laptopinventory.com/contact"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .addTagsItem(new Tag()
                        .name("Authentication")
                        .description("Endpoints for user authentication and registration"));
    }
}