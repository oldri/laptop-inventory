package com.oldri.laptopinventory.dto.request;

import com.oldri.laptopinventory.model.enums.RequestStatus;

public interface RequestStatusCountProjection {
    RequestStatus getStatus();
    long getCount();
}
