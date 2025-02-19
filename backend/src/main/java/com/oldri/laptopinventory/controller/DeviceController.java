package com.oldri.laptopinventory.controller;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.oldri.laptopinventory.dto.device.DeviceCreateDTO;
import com.oldri.laptopinventory.dto.device.DeviceDTO;
import com.oldri.laptopinventory.dto.device.DeviceLocationSummaryDTO;
import com.oldri.laptopinventory.dto.device.DeviceOverviewDTO;
import com.oldri.laptopinventory.dto.device.DeviceStatisticsDTO;
import com.oldri.laptopinventory.dto.device.DeviceStatusSummaryDTO;
import com.oldri.laptopinventory.dto.warranty.WarrantyCreateDTO;
import com.oldri.laptopinventory.dto.warranty.WarrantyDTO;
import com.oldri.laptopinventory.exception.ResourceNotFoundException;
import com.oldri.laptopinventory.model.enums.DeviceLocation;
import com.oldri.laptopinventory.model.enums.DeviceStatus;
import com.oldri.laptopinventory.security.utils.RoleUtility;
import com.oldri.laptopinventory.service.DeviceService;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {
    private final DeviceService deviceService;
    private static final String ACCESS_DENIED_MESSAGE = "Access denied";

    @GetMapping
    public ResponseEntity<?> getAllDevices(Pageable pageable) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }

        try {
            var devices = deviceService.getAllDevices(pageable);
            return ResponseEntity.ok(devices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching devices");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDeviceDetails(@PathVariable Long id) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            DeviceDTO device = deviceService.getDeviceDetails(id);
            return ResponseEntity.ok(device);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Device not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching device details");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchDevices(
            @RequestParam(required = false) String serialNumber,
            @RequestParam(required = false) DeviceStatus status,
            @RequestParam(required = false) DeviceLocation location,
            Pageable pageable) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            Page<DeviceDTO> devices = deviceService.searchDevices(serialNumber, status, location, pageable);
            return ResponseEntity.ok(devices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error searching devices");
        }
    }

    @PostMapping
    public ResponseEntity<?> createDevice(@RequestBody DeviceCreateDTO dto) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(deviceService.createDevice(dto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating device");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDevice(@PathVariable Long id, @RequestBody DeviceCreateDTO dto) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        return ResponseEntity.ok(deviceService.updateDevice(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDevice(@PathVariable Long id) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            deviceService.deleteDevice(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Device not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting device");
        }
    }

    @PostMapping("/{deviceId}/assign/{userId}")
    public ResponseEntity<?> assignDevice(@PathVariable Long deviceId, @PathVariable Long userId) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        return ResponseEntity.ok(deviceService.assignDevice(deviceId, userId));
    }

    @GetMapping("/{deviceId}/warranties")
    public ResponseEntity<?> getDeviceWarranties(@PathVariable Long deviceId) {
        if (!RoleUtility.isEmployee()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        return ResponseEntity.ok(deviceService.getDeviceWarranties(deviceId));
    }

    @PostMapping("/{deviceId}/warranties")
    public ResponseEntity<?> addWarranty(@PathVariable Long deviceId, @RequestBody WarrantyCreateDTO dto) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(deviceService.addWarranty(deviceId, dto));
    }

    @PutMapping("/{deviceId}/warranties/{warrantyId}")
    public ResponseEntity<?> updateWarranty(
            @PathVariable Long deviceId,
            @PathVariable Long warrantyId,
            @RequestBody WarrantyCreateDTO dto) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            WarrantyDTO warranty = deviceService.updateWarranty(deviceId, warrantyId, dto);
            return ResponseEntity.ok(warranty);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Warranty or device not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating warranty");
        }
    }

    @DeleteMapping("/{deviceId}/warranties/{warrantyId}")
    public ResponseEntity<?> deleteWarranty(
            @PathVariable Long deviceId,
            @PathVariable Long warrantyId) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            deviceService.deleteWarranty(deviceId, warrantyId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Warranty or device not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting warranty");
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getDeviceStatistics() {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            DeviceStatisticsDTO statistics = deviceService.getDeviceStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching device statistics");
        }
    }

    @GetMapping("/status-summary")
    public ResponseEntity<?> getDeviceStatusSummary() {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            List<DeviceStatusSummaryDTO> summary = deviceService.getDeviceStatusSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching device status summary");
        }
    }

    @GetMapping("/location-summary")
    public ResponseEntity<?> getLocationSummary() {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            List<DeviceLocationSummaryDTO> summary = deviceService.getLocationSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching location summary");
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDeviceOverview() {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            DeviceOverviewDTO overview = deviceService.getDeviceOverview();
            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching device overview");
        }
    }
}