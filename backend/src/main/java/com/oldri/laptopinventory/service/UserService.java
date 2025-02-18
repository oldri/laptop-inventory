package com.oldri.laptopinventory.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oldri.laptopinventory.dto.device.DeviceDTO;
import com.oldri.laptopinventory.dto.user.UserCreateDTO;
import com.oldri.laptopinventory.dto.user.UserDTO;
import com.oldri.laptopinventory.dto.user.UserUpdateDTO;
import com.oldri.laptopinventory.dto.warranty.WarrantyDTO;
import com.oldri.laptopinventory.exception.UserException;
import com.oldri.laptopinventory.model.Device;
import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.model.Warranty;
import com.oldri.laptopinventory.model.enums.Department;
import com.oldri.laptopinventory.model.enums.UserRole;
import com.oldri.laptopinventory.repository.UserRepository;
import com.oldri.laptopinventory.security.utils.RoleUtility;
import com.oldri.laptopinventory.security.utils.SecurityUtility;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDTO createUser(UserCreateDTO userCreateDTO) {
        if (userRepository.existsByUsername(userCreateDTO.getUsername())) {
            throw new UserException(
                    UserException.ErrorType.USERNAME_ALREADY_EXISTS,
                    "Username already exists");
        }

        User user = User.builder()
                .username(userCreateDTO.getUsername())
                .password(passwordEncoder.encode(userCreateDTO.getPassword()))
                .email(userCreateDTO.getEmail())
                .firstName(userCreateDTO.getFirstName())
                .lastName(userCreateDTO.getLastName())
                .phoneNumber(userCreateDTO.getPhoneNumber())
                .role(userCreateDTO.getRole())
                .department(userCreateDTO.getDepartment())
                .build();

        return convertToUserDTO(userRepository.save(user), false);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getUsers(Pageable pageable) {
        try {
            return userRepository.findAll(pageable)
                    .map(user -> convertToUserDTO(user, true));
        } catch (Exception e) {
            throw new RuntimeException("Error fetching users", e);
        }
    }

    @Transactional
    public UserDTO updateUser(Long id, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException(
                        UserException.ErrorType.USER_NOT_FOUND,
                        "User not found"));

        if (userUpdateDTO.getEmail() != null) {
            user.setEmail(userUpdateDTO.getEmail());
        }
        if (userUpdateDTO.getFirstName() != null) {
            user.setFirstName(userUpdateDTO.getFirstName());
        }
        if (userUpdateDTO.getLastName() != null) {
            user.setLastName(userUpdateDTO.getLastName());
        }
        if (userUpdateDTO.getPhoneNumber() != null) {
            user.setPhoneNumber(userUpdateDTO.getPhoneNumber());
        }
        if (userUpdateDTO.getDepartment() != null) {
            user.setDepartment(userUpdateDTO.getDepartment());
        }
        if (userUpdateDTO.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userUpdateDTO.getPassword()));
        }

        return convertToUserDTO(userRepository.save(user), false);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException(
                        UserException.ErrorType.USER_NOT_FOUND,
                        "User not found"));

        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException(
                        UserException.ErrorType.USER_NOT_FOUND,
                        "User not found"));

        if (RoleUtility.isEmployee() &&
                !SecurityUtility.getCurrentUserId(userRepository).equals(id)) {
            throw new AccessDeniedException("Employees can only view their own profile");
        }

        if (RoleUtility.isAdmin() && user.getRole() != UserRole.ROLE_EMPLOYEE) {
            throw new AccessDeniedException("Admins can only view employees");
        }

        return convertToUserDTO(user, true);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> searchUsers(
            String search,
            UserRole role,
            Department department,
            Pageable pageable) {

        if (RoleUtility.isAdmin()) {
            role = UserRole.ROLE_EMPLOYEE;
        }

        return userRepository.searchUsers(role, department, search, pageable)
                .map(user -> convertToUserDTO(user, true));
    }

    @Transactional(readOnly = true)
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserException(
                        UserException.ErrorType.USER_NOT_FOUND,
                        "User not found"));

        if (RoleUtility.isEmployee() &&
                !SecurityUtility.getCurrentUsername().equals(username)) {
            throw new AccessDeniedException("Employees can only view their own profile");
        }

        if (RoleUtility.isAdmin() && user.getRole() != UserRole.ROLE_EMPLOYEE) {
            throw new AccessDeniedException("Admins can only view employees");
        }

        return convertToUserDTO(user, true);
    }

    private UserDTO convertToUserDTO(User user, boolean includeDevices) {
        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .department(user.getDepartment())
                .isActive(user.isActive())
                .build();

        if (includeDevices && user.getAssignedDevices() != null) {
            List<DeviceDTO> deviceDTOs = user.getAssignedDevices().stream()
                    .map(device -> convertToDeviceDTO(device, false))
                    .collect(Collectors.toList());
            userDTO.setAssignedDevices(deviceDTOs);
        }

        return userDTO;
    }

    private DeviceDTO convertToDeviceDTO(Device device, boolean includeUser) {
        DeviceDTO.DeviceDTOBuilder builder = DeviceDTO.builder()
                .id(device.getId())
                .serialNumber(device.getSerialNumber())
                .manufacturer(device.getManufacturer())
                .modelName(device.getModelName())
                .status(device.getStatus())
                .purchaseDate(device.getPurchaseDate())
                .condition(device.getCondition())
                .location(device.getLocation())
                .createTime(device.getCreateTime())
                .updateTime(device.getUpdateTime());

        if (device.getWarranties() != null) {
            builder.warranties(device.getWarranties().stream()
                    .map(this::convertToWarrantyDTO)
                    .collect(Collectors.toList()));
        }

        if (includeUser && device.getAssignedUser() != null) {
            builder.assignedUser(convertToUserDTO(device.getAssignedUser(), false));
        }

        return builder.build();
    }

    private WarrantyDTO convertToWarrantyDTO(Warranty warranty) {
        return WarrantyDTO.builder()
                .id(warranty.getId())
                .warrantyId(warranty.getWarrantyId())
                .startDate(warranty.getStartDate())
                .endDate(warranty.getEndDate())
                .type(warranty.getType())
                .description(warranty.getDescription())
                .createTime(warranty.getCreateTime())
                .updateTime(warranty.getUpdateTime())
                .build();
    }
}