package com.oldri.laptopinventory.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oldri.laptopinventory.controller.DeviceRequestController;
import com.oldri.laptopinventory.dto.device.DeviceDTO;
import com.oldri.laptopinventory.dto.request.DeviceRequestCreateDTO;
import com.oldri.laptopinventory.dto.request.DeviceRequestDTO;
import com.oldri.laptopinventory.dto.user.UserDTO;
import com.oldri.laptopinventory.exception.ResourceNotFoundException;
import com.oldri.laptopinventory.model.Device;
import com.oldri.laptopinventory.model.DeviceRequest;
import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.model.enums.RequestStatus;
import com.oldri.laptopinventory.model.enums.RequestType;
import com.oldri.laptopinventory.repository.DeviceRepository;
import com.oldri.laptopinventory.repository.DeviceRequestRepository;
import com.oldri.laptopinventory.repository.UserRepository;
import com.oldri.laptopinventory.security.utils.SecurityUtility;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeviceRequestService {
    private final DeviceRequestRepository deviceRequestRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(DeviceRequestController.class);

    @Transactional(readOnly = true)
    public Page<DeviceRequestDTO> getAllDeviceRequests(Pageable pageable) {
        // Log the method call and parameters
        logger.info("Fetching all device requests with pageable: {}", pageable);

        try {
            Page<DeviceRequestDTO> deviceRequests = deviceRequestRepository.findAll(pageable).map(this::convertToDTO);
            // Log successful data retrieval
            logger.info("Successfully fetched device requests");
            return deviceRequests;
        } catch (Exception e) {
            // Log the exception
            logger.error("An error occurred while fetching device requests", e);
            throw new RuntimeException("An unexpected error occurred", e);
        }
    }

    @Transactional(readOnly = true)
    public DeviceRequestDTO getDeviceRequestById(Long id) {
        DeviceRequest request = deviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device request not found"));
        return convertToDTO(request);
    }

    @Transactional
    public DeviceRequestDTO createDeviceRequest(DeviceRequestCreateDTO dto) {
        // Retrieve the current authenticated user (requester) using SecurityUtils
        User requester = SecurityUtility.getCurrentUser(userRepository);

        // Build the DeviceRequest entity
        DeviceRequest request = DeviceRequest.builder()
                .requester(requester)
                .type(dto.getType())
                .status(RequestStatus.PENDING)
                .requestedDate(dto.getRequestedDate())
                .priority(dto.getPriority())
                .notes(dto.getNotes())
                .build();

        // Handle DEVICE_ASSIGNMENT requests
        if (dto.getType() == RequestType.DEVICE_ASSIGNMENT) {
            Device device = deviceRepository.findById(dto.getDeviceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Device not found"));
            request.setDevice(device);
        }
        // Handle NEW_DEVICE requests
        else if (dto.getType() == RequestType.NEW_DEVICE) {
            request.setQuantity(dto.getQuantity());
        }

        // Save the request and convert it to a DTO
        return convertToDTO(deviceRequestRepository.save(request));
    }

    @Transactional
    public DeviceRequestDTO updateDeviceRequestStatus(Long id, RequestStatus status, String reasonForRejection) {
        DeviceRequest request = deviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Request is already processed");
        }

        request.setStatus(status);
        request.setProcessedBy(SecurityUtility.getCurrentUser(userRepository));
        request.setReasonForRejection(reasonForRejection);

        return convertToDTO(deviceRequestRepository.save(request));
    }

    @Transactional
    public void deleteDeviceRequest(Long id) {
        DeviceRequest request = deviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device request not found"));
        deviceRequestRepository.delete(request);
    }

    private DeviceRequestDTO convertToDTO(DeviceRequest request) {
        return DeviceRequestDTO.builder()
                .id(request.getId())
                .requester(convertToUserDTO(request.getRequester()))
                .processedBy(request.getProcessedBy() != null ? convertToUserDTO(request.getProcessedBy()) : null)
                .type(request.getType())
                .status(request.getStatus())
                .priority(request.getPriority())
                .device(request.getDevice() != null ? convertToDeviceDTO(request.getDevice()) : null)
                .quantity(request.getQuantity())
                .notes(request.getNotes())
                .reasonForRejection(request.getReasonForRejection())
                .requestedDate(request.getRequestedDate())
                .createTime(request.getCreateTime())
                .updateTime(request.getUpdateTime())
                .build();
    }

    private UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
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
    }

    private DeviceDTO convertToDeviceDTO(Device device) {
        return DeviceDTO.builder()
                .id(device.getId())
                .serialNumber(device.getSerialNumber())
                .manufacturer(device.getManufacturer())
                .modelName(device.getModelName())
                .status(device.getStatus())
                .assignedUser(device.getAssignedUser() != null ? convertToUserDTO(device.getAssignedUser()) : null)
                .purchaseDate(device.getPurchaseDate())
                .condition(device.getCondition())
                .location(device.getLocation())
                .createTime(device.getCreateTime())
                .updateTime(device.getUpdateTime())
                .build();
    }
}