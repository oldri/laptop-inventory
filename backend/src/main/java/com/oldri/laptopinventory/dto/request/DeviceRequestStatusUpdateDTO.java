package com.oldri.laptopinventory.dto.request;

import com.oldri.laptopinventory.model.enums.RequestStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceRequestStatusUpdateDTO {
    private RequestStatus status;
    private String reasonForRejection;
}