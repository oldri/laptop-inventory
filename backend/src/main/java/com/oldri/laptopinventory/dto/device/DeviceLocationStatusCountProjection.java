package com.oldri.laptopinventory.dto.device;

import com.oldri.laptopinventory.model.enums.DeviceLocation;
import com.oldri.laptopinventory.model.enums.DeviceStatus;

public interface DeviceLocationStatusCountProjection {
    DeviceLocation getLocation();
    DeviceStatus getStatus();
    long getCount();
}
