package com.oldri.laptopinventory.dto.device;

import com.oldri.laptopinventory.model.enums.DeviceStatus;

public interface DeviceStatusCountProjection {
    DeviceStatus getStatus();
    long getCount();
}
