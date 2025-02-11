package com.oldri.laptopinventory.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationRequest {
    @Schema(description = "Username of the user", example = "john_doe")
    @NotBlank(message = "Username is required")
    private String username;

    @Schema(description = "Password of the user", example = "Password123!")
    @NotBlank(message = "Password is required")
    private String password;
}
