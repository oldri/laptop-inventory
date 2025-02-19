package com.oldri.laptopinventory.controller;

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
import com.oldri.laptopinventory.dto.request.DeviceRequestCreateDTO;
import com.oldri.laptopinventory.dto.request.DeviceRequestDTO;
import com.oldri.laptopinventory.dto.request.DeviceRequestStatusUpdateDTO;
import com.oldri.laptopinventory.dto.request.RequestDashboardDTO;
import com.oldri.laptopinventory.model.enums.RequestPriority;
import com.oldri.laptopinventory.model.enums.RequestStatus;
import com.oldri.laptopinventory.model.enums.RequestType;
import com.oldri.laptopinventory.security.utils.RoleUtility;
import com.oldri.laptopinventory.service.DeviceRequestService;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/device-requests")
@RequiredArgsConstructor
public class DeviceRequestController {
    private final DeviceRequestService deviceRequestService;
    private static final String ACCESS_DENIED_MESSAGE = "Access denied";

    @GetMapping
    public ResponseEntity<?> getAllDeviceRequests(
            @RequestParam(required = false) RequestType type,
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) RequestPriority priority,
            Pageable pageable) {

        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            Page<DeviceRequestDTO> deviceRequests = deviceRequestService.getAllDeviceRequests(type, status, priority,
                    pageable);
            return ResponseEntity.ok(deviceRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching device requests");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDeviceRequestById(@PathVariable Long id) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        return ResponseEntity.ok(deviceRequestService.getDeviceRequestById(id));
    }

    @PostMapping
    public ResponseEntity<?> createDeviceRequest(@RequestBody DeviceRequestCreateDTO dto) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(deviceRequestService.createDeviceRequest(dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDeviceRequestStatus(
            @PathVariable Long id,
            @RequestBody DeviceRequestStatusUpdateDTO updateDTO) {
        if (!RoleUtility.isSuperAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        return ResponseEntity.ok(deviceRequestService.updateDeviceRequestStatus(
                id,
                updateDTO.getStatus(),
                updateDTO.getReasonForRejection()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeviceRequest(@PathVariable Long id) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        deviceRequestService.deleteDeviceRequest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getRequestDashboard() {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            RequestDashboardDTO dashboard = deviceRequestService.getRequestDashboard();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching request dashboard");
        }
    }
}