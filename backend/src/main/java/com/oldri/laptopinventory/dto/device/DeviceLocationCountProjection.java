package com.oldri.laptopinventory.dto.device;

import com.oldri.laptopinventory.model.enums.DeviceLocation;

public interface DeviceLocationCountProjection {
    DeviceLocation getLocation();
    long getCount();
}
