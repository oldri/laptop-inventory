package com.oldri.laptopinventory.controller;

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
import com.oldri.laptopinventory.model.enums.RequestStatus;
import com.oldri.laptopinventory.security.utils.RoleUtility;
import com.oldri.laptopinventory.service.DeviceRequestService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/device-requests")
@RequiredArgsConstructor
public class DeviceRequestController {
    private final DeviceRequestService deviceRequestService;
    private static final Logger logger = LoggerFactory.getLogger(DeviceRequestController.class);

    @GetMapping
    public ResponseEntity<?> getAllDeviceRequests(Pageable pageable) {
        // Log the method call and parameters
        logger.info("Fetching all device requests with pageable: {}", pageable);

        if (!RoleUtility.isSuperAdminOrAdmin()) {
            logger.warn("Access denied: User does not have required role");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        try {
            // Log successful data retrieval
            logger.info("Successfully fetched device requests");
            return ResponseEntity.ok(deviceRequestService.getAllDeviceRequests(pageable));
        } catch (Exception e) {
            // Log the exception
            logger.error("An error occurred while fetching device requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDeviceRequestById(@PathVariable Long id) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        return ResponseEntity.ok(deviceRequestService.getDeviceRequestById(id));
    }

    @PostMapping
    public ResponseEntity<?> createDeviceRequest(@RequestBody DeviceRequestCreateDTO dto) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(deviceRequestService.createDeviceRequest(dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateDeviceRequestStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status,
            @RequestParam(required = false) String reasonForRejection) {
        if (!RoleUtility.isSuperAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        return ResponseEntity.ok(deviceRequestService.updateDeviceRequestStatus(id, status, reasonForRejection));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeviceRequest(@PathVariable Long id) {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        deviceRequestService.deleteDeviceRequest(id);
        return ResponseEntity.noContent().build();
    }
}