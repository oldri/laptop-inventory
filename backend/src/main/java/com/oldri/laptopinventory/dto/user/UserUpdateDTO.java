package com.oldri.laptopinventory.dto.user;

import com.oldri.laptopinventory.model.enums.Department;
import com.oldri.laptopinventory.model.enums.UserRole;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Schema(description = "Email of the user", example = "john.doe@example.com")
    private String email;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    @Schema(description = "First name of the user", example = "John")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    @Schema(description = "Last name of the user", example = "Doe")
    private String lastName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be in international format")
    @Schema(description = "Phone number of the user", example = "+1234567890")
    private String phoneNumber;

    @Schema(description = "Role of the user", example = "EMPLOYEE")
    @NotNull(message = "Role is required")
    private UserRole role;

    @Schema(description = "Department of the user", example = "TECH")
    @NotNull(message = "Department is required")
    private Department department;

    @Schema(description = "Active status of the user", example = "true")
    @NotNull(message = "Active status is required")
    private Boolean isActive;

    @Size(min = 8, message = "Password must be at least 8 characters")
    @Schema(description = "Password of the user", example = "Password123!")
    private String password;
}
