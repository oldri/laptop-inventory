package com.oldri.laptopinventory.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.oldri.laptopinventory.dto.device.DeviceConditionCountProjection;
import com.oldri.laptopinventory.dto.device.DeviceCreateDTO;
import com.oldri.laptopinventory.dto.device.DeviceDTO;
import com.oldri.laptopinventory.dto.device.DeviceLocationCountProjection;
import com.oldri.laptopinventory.dto.device.DeviceLocationStatusCountProjection;
import com.oldri.laptopinventory.dto.device.DeviceLocationSummaryDTO;
import com.oldri.laptopinventory.dto.device.DeviceOverviewDTO;
import com.oldri.laptopinventory.dto.device.DeviceStatisticsDTO;
import com.oldri.laptopinventory.dto.device.DeviceStatusConditionCountProjection;
import com.oldri.laptopinventory.dto.device.DeviceStatusCountProjection;
import com.oldri.laptopinventory.dto.device.DeviceStatusSummaryDTO;
import com.oldri.laptopinventory.dto.user.UserDTO;
import com.oldri.laptopinventory.dto.warranty.WarrantyCreateDTO;
import com.oldri.laptopinventory.dto.warranty.WarrantyDTO;
import com.oldri.laptopinventory.exception.ResourceConflictException;
import com.oldri.laptopinventory.exception.ResourceNotFoundException;
import com.oldri.laptopinventory.model.Device;
import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.model.Warranty;
import com.oldri.laptopinventory.model.enums.DeviceCondition;
import com.oldri.laptopinventory.model.enums.DeviceLocation;
import com.oldri.laptopinventory.model.enums.DeviceStatus;
import com.oldri.laptopinventory.repository.DeviceRepository;
import com.oldri.laptopinventory.repository.UserRepository;
import com.oldri.laptopinventory.repository.WarrantyRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeviceService {
        private final DeviceRepository deviceRepository;
        private final UserRepository userRepository;
        private final WarrantyRepository warrantyRepository;
        private static final String DEVICE_REQUEST_NOT_FOUND = "Device request not found";

        @Transactional(readOnly = true)
        public Page<DeviceDTO> getAllDevices(Pageable pageable) {
                try {
                        return deviceRepository.findAll(pageable).map(this::convertToDTO);
                } catch (Exception e) {
                        throw new RuntimeException("Error fetching devices", e);
                }
        }

        @Transactional(readOnly = true)
        public DeviceDTO getDeviceDetails(Long id) {
                Device device = deviceRepository.findByIdWithWarranties(id)
                                .orElseThrow(() -> new ResourceNotFoundException(DEVICE_REQUEST_NOT_FOUND));
                return convertToDTO(device);
        }

        @Transactional(readOnly = true)
        public Page<DeviceDTO> searchDevices(String serialNumber, DeviceStatus status, DeviceLocation location,
                        Pageable pageable) {
                Specification<Device> spec = Specification.where(null);
                if (serialNumber != null) {
                        spec = spec.and((root, query, cb) -> cb.like(root.get("serialNumber"),
                                        "%" + serialNumber + "%"));
                }
                if (status != null) {
                        spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
                }
                if (location != null) {
                        spec = spec.and((root, query, cb) -> cb.equal(root.get("location"), location));
                }
                return deviceRepository.findAll(spec, pageable).map(this::convertToDTO);
        }

        @Transactional
        public DeviceDTO createDevice(DeviceCreateDTO dto) {
                if (deviceRepository.existsBySerialNumber(dto.getSerialNumber())) {
                        throw new ResourceConflictException("Device with this serial number already exists");
                }
                Device device = Device.builder()
                                .serialNumber(dto.getSerialNumber())
                                .manufacturer(dto.getManufacturer())
                                .modelName(dto.getModelName())
                                .status(DeviceStatus.AVAILABLE)
                                .purchaseDate(dto.getPurchaseDate())
                                .condition(dto.getCondition())
                                .location(dto.getLocation())
                                .build();
                return convertToDTO(deviceRepository.save(device));
        }

        @Transactional
        public DeviceDTO updateDevice(Long id, DeviceCreateDTO dto) {
                Device device = deviceRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(DEVICE_REQUEST_NOT_FOUND));
                if (!device.getSerialNumber().equals(dto.getSerialNumber()) &&
                                deviceRepository.existsBySerialNumber(dto.getSerialNumber())) {
                        throw new ResourceConflictException("Serial number already exists");
                }
                device.setSerialNumber(dto.getSerialNumber());
                device.setManufacturer(dto.getManufacturer());
                device.setModelName(dto.getModelName());
                device.setPurchaseDate(dto.getPurchaseDate());
                device.setCondition(dto.getCondition());
                device.setLocation(dto.getLocation());
                return convertToDTO(deviceRepository.save(device));
        }

        @Transactional
        public void deleteDevice(Long id) {
                Device device = deviceRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(DEVICE_REQUEST_NOT_FOUND));
                deviceRepository.delete(device);
        }

        @Transactional
        public DeviceDTO assignDevice(Long deviceId, Long userId) {
                Device device = deviceRepository.findById(deviceId)
                                .orElseThrow(() -> new ResourceNotFoundException(DEVICE_REQUEST_NOT_FOUND));
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                device.setAssignedUser(user);
                device.setStatus(DeviceStatus.ASSIGNED);
                device.setLocation(DeviceLocation.WITH_EMPLOYEE);
                return convertToDTO(deviceRepository.save(device));
        }

        @Transactional(readOnly = true)
        public List<WarrantyDTO> getDeviceWarranties(Long deviceId) {
                Device device = deviceRepository.findById(deviceId)
                                .orElseThrow(() -> new ResourceNotFoundException(DEVICE_REQUEST_NOT_FOUND));
                return warrantyRepository.findByDevice(device).stream()
                                .map(this::convertToWarrantyDTO)
                                .toList();
        }

        @Transactional
        public WarrantyDTO addWarranty(Long deviceId, WarrantyCreateDTO dto) {
                Device device = deviceRepository.findById(deviceId)
                                .orElseThrow(() -> new ResourceNotFoundException(DEVICE_REQUEST_NOT_FOUND));
                if (warrantyRepository.existsByWarrantyId(dto.getWarrantyId())) {
                        throw new ResourceConflictException("Warranty ID already exists");
                }
                Warranty warranty = Warranty.builder()
                                .device(device)
                                .warrantyId(dto.getWarrantyId())
                                .startDate(dto.getStartDate())
                                .endDate(dto.getEndDate())
                                .type(dto.getType())
                                .description(dto.getDescription())
                                .build();
                return convertToWarrantyDTO(warrantyRepository.save(warranty));
        }

        @Transactional
        public WarrantyDTO updateWarranty(Long deviceId, Long warrantyId, WarrantyCreateDTO dto) {
                Warranty warranty = warrantyRepository.findById(warrantyId)
                                .orElseThrow(() -> new ResourceNotFoundException("Warranty not found"));
                if (!warranty.getDevice().getId().equals(deviceId)) {
                        throw new ResourceNotFoundException("Warranty does not belong to the specified device");
                }
                warranty.setWarrantyId(dto.getWarrantyId());
                warranty.setStartDate(dto.getStartDate());
                warranty.setEndDate(dto.getEndDate());
                warranty.setType(dto.getType());
                warranty.setDescription(dto.getDescription());
                return convertToWarrantyDTO(warrantyRepository.save(warranty));
        }

        @Transactional
        public void deleteWarranty(Long deviceId, Long warrantyId) {
                Warranty warranty = warrantyRepository.findById(warrantyId)
                                .orElseThrow(() -> new ResourceNotFoundException("Warranty not found"));
                if (!warranty.getDevice().getId().equals(deviceId)) {
                        throw new ResourceNotFoundException("Warranty does not belong to the specified device");
                }
                warrantyRepository.delete(warranty);
        }

        @Transactional(readOnly = true)
        public DeviceStatisticsDTO getDeviceStatistics() {
                long totalDevices = deviceRepository.count();

                Map<DeviceStatus, Long> statusCounts = deviceRepository.countByStatus()
                                .stream()
                                .collect(Collectors.toMap(
                                                DeviceStatusCountProjection::getStatus,
                                                DeviceStatusCountProjection::getCount));

                Map<DeviceCondition, Long> conditionCounts = deviceRepository.countByCondition()
                                .stream()
                                .collect(Collectors.toMap(
                                                DeviceConditionCountProjection::getCondition,
                                                DeviceConditionCountProjection::getCount));

                Map<DeviceLocation, Long> locationCounts = deviceRepository.countByLocation()
                                .stream()
                                .collect(Collectors.toMap(
                                                DeviceLocationCountProjection::getLocation,
                                                DeviceLocationCountProjection::getCount));

                return DeviceStatisticsDTO.builder()
                                .statusCounts(statusCounts)
                                .conditionCounts(conditionCounts)
                                .locationCounts(locationCounts)
                                .totalDevices(totalDevices)
                                .statusPercentages(calculatePercentages(statusCounts, totalDevices))
                                .conditionPercentages(calculatePercentages(conditionCounts, totalDevices))
                                .locationPercentages(calculatePercentages(locationCounts, totalDevices))
                                .build();
        }

        @Transactional(readOnly = true)
        public List<DeviceStatusSummaryDTO> getDeviceStatusSummary() {
                long totalDevices = deviceRepository.count();
                // Use the projection for status/condition counts
                List<DeviceStatusConditionCountProjection> statusConditionProjections = deviceRepository
                                .countByStatusAndCondition();

                Map<DeviceStatus, List<DeviceStatusConditionCountProjection>> groupedByStatus = statusConditionProjections
                                .stream()
                                .collect(Collectors.groupingBy(DeviceStatusConditionCountProjection::getStatus));

                return groupedByStatus.entrySet().stream()
                                .map(entry -> {
                                        DeviceStatus status = entry.getKey();
                                        List<DeviceStatusConditionCountProjection> projections = entry.getValue();
                                        long statusCount = projections.stream()
                                                        .mapToLong(DeviceStatusConditionCountProjection::getCount)
                                                        .sum();

                                        List<DeviceStatusSummaryDTO.DeviceConditionCount> conditionBreakdown = projections
                                                        .stream()
                                                        .map(projection -> DeviceStatusSummaryDTO.DeviceConditionCount
                                                                        .builder()
                                                                        .condition(projection.getCondition())
                                                                        .count(projection.getCount())
                                                                        .build())
                                                        .collect(Collectors.toList());

                                        return DeviceStatusSummaryDTO.builder()
                                                        .status(status)
                                                        .count(statusCount)
                                                        .percentage((double) statusCount / totalDevices * 100)
                                                        .conditionBreakdown(conditionBreakdown)
                                                        .build();
                                })
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<DeviceLocationSummaryDTO> getLocationSummary() {
                long totalDevices = deviceRepository.count();
                // Use the projection for location and status counts
                List<DeviceLocationStatusCountProjection> locationStatusProjections = deviceRepository
                                .countByLocationAndStatus();

                Map<DeviceLocation, List<DeviceLocationStatusCountProjection>> groupedByLocation = locationStatusProjections
                                .stream()
                                .collect(Collectors.groupingBy(DeviceLocationStatusCountProjection::getLocation));

                return groupedByLocation.entrySet().stream()
                                .map(entry -> {
                                        DeviceLocation location = entry.getKey();
                                        List<DeviceLocationStatusCountProjection> projections = entry.getValue();
                                        long locationCount = projections.stream()
                                                        .mapToLong(DeviceLocationStatusCountProjection::getCount)
                                                        .sum();

                                        List<DeviceLocationSummaryDTO.DeviceStatusCount> statusBreakdown = projections
                                                        .stream()
                                                        .map(projection -> DeviceLocationSummaryDTO.DeviceStatusCount
                                                                        .builder()
                                                                        .status(projection.getStatus())
                                                                        .count(projection.getCount())
                                                                        .build())
                                                        .collect(Collectors.toList());

                                        return DeviceLocationSummaryDTO.builder()
                                                        .location(location)
                                                        .count(locationCount)
                                                        .percentage((double) locationCount / totalDevices * 100)
                                                        .statusBreakdown(statusBreakdown)
                                                        .build();
                                })
                                .collect(Collectors.toList());
        }

        private <T> Map<T, Double> calculatePercentages(Map<T, Long> counts, long total) {
                return counts.entrySet().stream()
                                .collect(Collectors.toMap(
                                                Map.Entry::getKey,
                                                entry -> (double) entry.getValue() / total * 100));
        }

        @Transactional(readOnly = true)
        public DeviceOverviewDTO getDeviceOverview() {
                Map<DeviceStatus, Long> statusCounts = deviceRepository.countByStatus()
                                .stream()
                                .collect(Collectors.toMap(
                                                DeviceStatusCountProjection::getStatus,
                                                DeviceStatusCountProjection::getCount));

                Map<DeviceCondition, Long> conditionCounts = deviceRepository.countByCondition()
                                .stream()
                                .collect(Collectors.toMap(
                                                DeviceConditionCountProjection::getCondition,
                                                DeviceConditionCountProjection::getCount));

                Map<DeviceLocation, Long> locationCounts = deviceRepository.countByLocation()
                                .stream()
                                .collect(Collectors.toMap(
                                                DeviceLocationCountProjection::getLocation,
                                                DeviceLocationCountProjection::getCount));

                // Get top 3 locations by count
                Map<DeviceLocation, Long> topLocations = locationCounts.entrySet().stream()
                                .sorted(Map.Entry.<DeviceLocation, Long>comparingByValue().reversed())
                                .limit(3)
                                .collect(Collectors.toMap(
                                                Map.Entry::getKey,
                                                Map.Entry::getValue,
                                                (e1, e2) -> e1,
                                                LinkedHashMap::new));

                return DeviceOverviewDTO.builder()
                                .totalAvailable(statusCounts.getOrDefault(DeviceStatus.AVAILABLE, 0L))
                                .totalAssigned(statusCounts.getOrDefault(DeviceStatus.ASSIGNED, 0L))
                                .totalUnderMaintenance(statusCounts.getOrDefault(DeviceStatus.MAINTENANCE, 0L))
                                .conditionDistribution(conditionCounts)
                                .topLocations(topLocations)
                                .totalDevices(deviceRepository.count())
                                .build();
        }

        private DeviceDTO convertToDTO(Device device) {
                return DeviceDTO.builder()
                                .id(device.getId())
                                .serialNumber(device.getSerialNumber())
                                .manufacturer(device.getManufacturer())
                                .modelName(device.getModelName())
                                .status(device.getStatus())
                                .assignedUser(device.getAssignedUser() != null
                                                ? convertToUserDTO(device.getAssignedUser())
                                                : null)
                                .warranties(device.getWarranties().stream()
                                                .map(this::convertToWarrantyDTO)
                                                .toList())
                                .purchaseDate(device.getPurchaseDate())
                                .condition(device.getCondition())
                                .location(device.getLocation())
                                .createTime(device.getCreateTime())
                                .updateTime(device.getUpdateTime())
                                .build();
        }

        private WarrantyDTO convertToWarrantyDTO(Warranty warranty) {
                return WarrantyDTO.builder()
                                .id(warranty.getId())
                                .warrantyId(warranty.getWarrantyId())
                                .startDate(warranty.getStartDate())
                                .endDate(warranty.getEndDate())
                                .type(warranty.getType())
                                .description(warranty.getDescription())
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
}