package com.oldri.laptopinventory.dto.request;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.oldri.laptopinventory.dto.device.DeviceDTO;
import com.oldri.laptopinventory.dto.user.UserDTO;
import com.oldri.laptopinventory.model.enums.RequestPriority;
import com.oldri.laptopinventory.model.enums.RequestStatus;
import com.oldri.laptopinventory.model.enums.RequestType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceRequestDTO {
    private Long id;
    private UserDTO requester;
    private UserDTO processedBy;
    private RequestType type;
    private RequestStatus status;
    private RequestPriority priority;
    private DeviceDTO device;
    private Integer quantity;
    private String notes;
    private String reasonForRejection;
    private LocalDate requestedDate;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}