package com.oldri.laptopinventory.dto.warranty;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.oldri.laptopinventory.model.enums.WarrantyStatus;
import com.oldri.laptopinventory.model.enums.WarrantyType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WarrantyDTO {
    private Long id;
    private String warrantyId;
    private LocalDate startDate;
    private LocalDate endDate;
    private WarrantyType type;
    private String description;

    @JsonProperty("status")
    public WarrantyStatus getStatus() {
        LocalDate now = LocalDate.now();
        if (now.isBefore(startDate)) {
            return WarrantyStatus.PENDING;
        } else if (now.isAfter(endDate)) {
            return WarrantyStatus.EXPIRED;
        } else {
            return WarrantyStatus.ACTIVE;
        }
    }
}
