package com.oldri.laptopinventory.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.oldri.laptopinventory.dto.warranty.WarrantyDashboardDTO;
import com.oldri.laptopinventory.security.utils.RoleUtility;
import com.oldri.laptopinventory.service.WarrantyService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/warranties")
@RequiredArgsConstructor
public class WarrantyController {
    private final WarrantyService warrantyService;
    private static final String ACCESS_DENIED_MESSAGE = "Access denied";

    @GetMapping("/dashboard")
    public ResponseEntity<?> getWarrantyDashboard() {
        if (!RoleUtility.isSuperAdminOrAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ACCESS_DENIED_MESSAGE);
        }
        try {
            WarrantyDashboardDTO dashboard = warrantyService.getWarrantyDashboard();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching warranty dashboard");
        }
    }
}
