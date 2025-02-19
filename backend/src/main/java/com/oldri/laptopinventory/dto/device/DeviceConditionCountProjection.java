package com.oldri.laptopinventory.dto.device;

import com.oldri.laptopinventory.model.enums.DeviceCondition;

public interface DeviceConditionCountProjection {
    DeviceCondition getCondition();
    long getCount();
}
