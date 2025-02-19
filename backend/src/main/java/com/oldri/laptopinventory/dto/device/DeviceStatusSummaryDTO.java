package com.oldri.laptopinventory.dto.device;

import java.util.List;
import com.oldri.laptopinventory.model.enums.DeviceCondition;
import com.oldri.laptopinventory.model.enums.DeviceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceStatusSummaryDTO {
    private DeviceStatus status;
    private long count;
    private double percentage;
    private List<DeviceConditionCount> conditionBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceConditionCount {
        private DeviceCondition condition;
        private long count;
    }
}
