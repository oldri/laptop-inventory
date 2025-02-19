package com.oldri.laptopinventory.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.oldri.laptopinventory.dto.device.DeviceDTO;
import com.oldri.laptopinventory.dto.request.DeviceRequestCreateDTO;
import com.oldri.laptopinventory.dto.request.DeviceRequestDTO;
import com.oldri.laptopinventory.dto.request.RequestDashboardDTO;
import com.oldri.laptopinventory.dto.request.RequestStatusCountProjection;
import com.oldri.laptopinventory.dto.request.RequestSummaryDTO;
import com.oldri.laptopinventory.dto.request.RequestTypeCountProjection;
import com.oldri.laptopinventory.dto.user.UserDTO;
import com.oldri.laptopinventory.exception.ResourceNotFoundException;
import com.oldri.laptopinventory.model.Device;
import com.oldri.laptopinventory.model.DeviceRequest;
import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.model.enums.RequestPriority;
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
    private static final String DEVICE_REQUEST_NOT_FOUND = "Device request not found";

    @Transactional(readOnly = true)
    public Page<DeviceRequestDTO> getAllDeviceRequests(RequestType type, RequestStatus status, RequestPriority priority,
            Pageable pageable) {
        try {
            Page<DeviceRequest> deviceRequests = deviceRequestRepository.findAllByFilters(type, status, priority,
                    pageable);
            return deviceRequests.map(this::convertToDTO);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching device requests", e);
        }
    }

    @Transactional(readOnly = true)
    public DeviceRequestDTO getDeviceRequestById(Long id) {
        DeviceRequest request = deviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(DEVICE_REQUEST_NOT_FOUND));
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
                .orElseThrow(() -> new ResourceNotFoundException(DEVICE_REQUEST_NOT_FOUND));

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
                .orElseThrow(() -> new ResourceNotFoundException(DEVICE_REQUEST_NOT_FOUND));
        deviceRequestRepository.delete(request);
    }

    @Transactional(readOnly = true)
    public RequestDashboardDTO getRequestDashboard() {
        // Count aggregations using projections
        Map<RequestType, Long> typeCounts = deviceRequestRepository.countByRequestType()
                .stream()
                .collect(Collectors.toMap(
                        RequestTypeCountProjection::getType,
                        RequestTypeCountProjection::getCount));

        Map<RequestStatus, Long> statusCounts = deviceRequestRepository.countByRequestStatus()
                .stream()
                .collect(Collectors.toMap(
                        RequestStatusCountProjection::getStatus,
                        RequestStatusCountProjection::getCount));

        // Fetch the top 10 recent requests using the new repository method name
        List<RequestSummaryDTO> recentRequests = deviceRequestRepository.findTop10ByOrderByCreateTimeDesc()
                .stream()
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList());

        return RequestDashboardDTO.builder()
                .typeCounts(typeCounts)
                .statusCounts(statusCounts)
                .recentRequests(recentRequests)
                .totalRequests(deviceRequestRepository.count())
                .build();
    }

    private RequestSummaryDTO convertToSummaryDTO(DeviceRequest request) {
        return RequestSummaryDTO.builder()
                .id(request.getId())
                .type(request.getType())
                .status(request.getStatus())
                .requesterEmail(request.getRequester().getEmail())
                .createTime(request.getCreateTime())
                .updateTime(request.getUpdateTime())
                .build();
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