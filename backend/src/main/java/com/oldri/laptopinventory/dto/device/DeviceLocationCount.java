package com.oldri.laptopinventory.dto.device;

import com.oldri.laptopinventory.model.enums.DeviceLocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceLocationCount {
    private DeviceLocation location;
    private Long count;
}