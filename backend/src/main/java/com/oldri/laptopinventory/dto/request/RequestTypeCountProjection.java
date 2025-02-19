package com.oldri.laptopinventory.dto.request;

import com.oldri.laptopinventory.model.enums.RequestType;

public interface RequestTypeCountProjection {
    RequestType getType();
    long getCount();
}
