package com.oldri.laptopinventory.dto.device;

import java.util.Map;

import com.oldri.laptopinventory.model.enums.DeviceCondition;
import com.oldri.laptopinventory.model.enums.DeviceLocation;
import com.oldri.laptopinventory.model.enums.DeviceStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceStatisticsDTO {
    private Map<DeviceStatus, Long> statusCounts;
    private Map<DeviceCondition, Long> conditionCounts;
    private Map<DeviceLocation, Long> locationCounts;
    private long totalDevices;
    private Map<DeviceStatus, Double> statusPercentages;
    private Map<DeviceCondition, Double> conditionPercentages;
    private Map<DeviceLocation, Double> locationPercentages;
}