package com.oldri.laptopinventory.dto.warranty;

import java.time.LocalDate;

import com.oldri.laptopinventory.model.enums.WarrantyType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarrantyCreateDTO {
    @NotBlank(message = "Warranty ID is required")
    @Size(max = 50, message = "Warranty ID cannot exceed 50 characters")
    private String warrantyId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Warranty type is required")
    private WarrantyType type;

    private String description;
}
