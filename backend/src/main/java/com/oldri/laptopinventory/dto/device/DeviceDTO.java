package com.oldri.laptopinventory.dto.device;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.oldri.laptopinventory.dto.user.UserDTO;
import com.oldri.laptopinventory.dto.warranty.WarrantyDTO;
import com.oldri.laptopinventory.model.enums.DeviceCondition;
import com.oldri.laptopinventory.model.enums.DeviceLocation;
import com.oldri.laptopinventory.model.enums.DeviceStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceDTO {
    private Long id;
    private String serialNumber;
    private String modelName;
    private String manufacturer;
    private DeviceStatus status;
    private DeviceCondition condition;
    private DeviceLocation location;
    private LocalDate purchaseDate;
    private UserDTO assignedUser;
    private List<WarrantyDTO> warranties;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
