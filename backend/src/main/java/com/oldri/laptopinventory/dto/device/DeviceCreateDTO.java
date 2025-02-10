package com.oldri.laptopinventory.dto.device;

import java.time.LocalDate;

import com.oldri.laptopinventory.model.enums.DeviceCondition;
import com.oldri.laptopinventory.model.enums.DeviceLocation;

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
public class DeviceCreateDTO {
    @NotBlank(message = "Serial number is required")
    @Size(max = 50, message = "Serial number cannot exceed 50 characters")
    private String serialNumber;

    @NotBlank(message = "Model name is required")
    @Size(max = 100, message = "Model name cannot exceed 100 characters")
    private String modelName;

    @NotBlank(message = "Manufacturer is required")
    @Size(max = 100, message = "Manufacturer cannot exceed 100 characters")
    private String manufacturer;

    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    @NotNull(message = "Condition is required")
    private DeviceCondition condition;

    @NotNull(message = "Location is required")
    private DeviceLocation location;
}