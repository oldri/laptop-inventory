package com.oldri.laptopinventory.dto.device;

import com.oldri.laptopinventory.model.enums.DeviceStatus;
import com.oldri.laptopinventory.model.enums.DeviceCondition;

public interface DeviceStatusConditionCountProjection {
    DeviceStatus getStatus();
    DeviceCondition getCondition();
    long getCount();
}
