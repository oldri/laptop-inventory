package com.oldri.laptopinventory.dto.device;

import java.util.Map;

import com.oldri.laptopinventory.model.enums.DeviceCondition;
import com.oldri.laptopinventory.model.enums.DeviceLocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceOverviewDTO {
    private long totalAvailable;
    private long totalAssigned;
    private long totalUnderMaintenance;
    private Map<DeviceCondition, Long> conditionDistribution;
    private Map<DeviceLocation, Long> topLocations;
    private long totalDevices;
}