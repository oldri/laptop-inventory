package com.oldri.laptopinventory.dto.device;

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
public class DeviceLocationStatusCount {
    private DeviceLocation location;
    private DeviceStatus status;
    private long count; 
}
