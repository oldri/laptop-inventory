package com.oldri.laptopinventory.service;

import java.util.List;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oldri.laptopinventory.dto.device.DeviceCreateDTO;
import com.oldri.laptopinventory.dto.device.DeviceDTO;
import com.oldri.laptopinventory.dto.user.UserDTO;
import com.oldri.laptopinventory.dto.warranty.WarrantyCreateDTO;
import com.oldri.laptopinventory.dto.warranty.WarrantyDTO;
import com.oldri.laptopinventory.exception.ResourceConflictException;
import com.oldri.laptopinventory.exception.ResourceNotFoundException;
import com.oldri.laptopinventory.model.Device;
import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.model.Warranty;
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
                                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));
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
                                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));
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
                                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));
                deviceRepository.delete(device);
        }

        @Transactional
        public DeviceDTO assignDevice(Long deviceId, Long userId) {
                Device device = deviceRepository.findById(deviceId)
                                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));
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
                                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));
                return warrantyRepository.findByDevice(device).stream()
                                .map(this::convertToWarrantyDTO)
                                .toList();
        }

        @Transactional
        public WarrantyDTO addWarranty(Long deviceId, WarrantyCreateDTO dto) {
                Device device = deviceRepository.findById(deviceId)
                                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));
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