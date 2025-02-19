package com.oldri.laptopinventory.dto.user;

import java.util.List;

import com.oldri.laptopinventory.dto.device.DeviceDTO;
import com.oldri.laptopinventory.model.enums.Department;
import com.oldri.laptopinventory.model.enums.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private UserRole role;
    private Department department;
    private Boolean isActive;
    private List<DeviceDTO> assignedDevices;
    // Exclude password for security
}