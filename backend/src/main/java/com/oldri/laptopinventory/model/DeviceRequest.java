package com.oldri.laptopinventory.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.oldri.laptopinventory.model.enums.RequestPriority;
import com.oldri.laptopinventory.model.enums.RequestStatus;
import com.oldri.laptopinventory.model.enums.RequestType;

import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "device_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester; // Admin/Super Admin who made the request

    @ManyToOne
    @JoinColumn(name = "processed_by_id")
    private User processedBy; // Admin/Super Admin who processed the request

    @Column(name = "requested_date", nullable = false)
    @NotNull(message = "Requested date is required")
    private LocalDate requestedDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestType type; // NEW_DEVICE or DEVICE_ASSIGNMENT

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING; // Default to PENDING

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device; // Null for NEW_DEVICE requests

    @Column(name = "quantity")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity; // For NEW_DEVICE requests

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "reason_for_rejection", columnDefinition = "TEXT")
    private String reasonForRejection;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", length = 20, nullable = false)
    private RequestPriority priority = RequestPriority.MEDIUM;

    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime = LocalDateTime.now();

    @Column(name = "update_time", nullable = false)
    private LocalDateTime updateTime = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updateTime = LocalDateTime.now();
    }
}
