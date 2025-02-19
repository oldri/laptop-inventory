package com.oldri.laptopinventory.dto.device;

import java.util.List;
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
public class DeviceLocationSummaryDTO {
    private DeviceLocation location;
    private long count;
    private double percentage;
    private List<DeviceStatusCount> statusBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceStatusCount {
        private DeviceStatus status;
        private long count;
    }
}
