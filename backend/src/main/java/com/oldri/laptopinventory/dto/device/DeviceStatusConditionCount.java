package com.oldri.laptopinventory.dto.device;

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
public class DeviceStatusConditionCount {
    private DeviceStatus status;
    private DeviceCondition condition;
    private long count;
}
