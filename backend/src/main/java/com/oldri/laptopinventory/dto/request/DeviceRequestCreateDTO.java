package com.oldri.laptopinventory.dto.request;

import java.time.LocalDate;

import com.oldri.laptopinventory.model.enums.RequestPriority;
import com.oldri.laptopinventory.model.enums.RequestType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceRequestCreateDTO {
    @NotNull(message = "Request type is required")
    private RequestType type;

    private Long deviceId; // Required for DEVICE_ASSIGNMENT

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity; // Required for NEW_DEVICE

    @NotNull(message = "Requested date is required")
    private LocalDate requestedDate;

    @NotNull(message = "Priority is required")
    private RequestPriority priority;

    private String notes;
}