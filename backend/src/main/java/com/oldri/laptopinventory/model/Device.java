package com.oldri.laptopinventory.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oldri.laptopinventory.model.enums.DeviceCondition;
import com.oldri.laptopinventory.model.enums.DeviceLocation;
import com.oldri.laptopinventory.model.enums.DeviceStatus;

import jakarta.persistence.Id;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "devices")
@Data
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "serial_number", length = 50, unique = true, nullable = false)
    @NotBlank(message = "Serial number is required")
    @Size(max = 50, message = "Serial number cannot exceed 50 characters")
    private String serialNumber;

    @Column(name = "manufacturer", length = 100, nullable = false)
    @NotBlank(message = "Manufacturer is required")
    @Size(max = 100, message = "Manufacturer cannot exceed 100 characters")
    private String manufacturer;

    @Column(name = "model_name", length = 100, nullable = false)
    @NotBlank(message = "Model name is required")
    @Size(max = 100, message = "Model name cannot exceed 100 characters")
    private String modelName;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private DeviceStatus status = DeviceStatus.AVAILABLE; // Default to AVAILABLE

    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser; // Nullable for unassigned devices

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Warranty> warranties = new ArrayList<>();

    @Column(name = "purchase_date")
    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition", length = 20, nullable = false)
    private DeviceCondition condition = DeviceCondition.NEW;

    @Enumerated(EnumType.STRING)
    @Column(name = "location", length = 20, nullable = false)
    private DeviceLocation location = DeviceLocation.WAREHOUSE;

    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime = LocalDateTime.now();

    @Column(name = "update_time", nullable = false)
    private LocalDateTime updateTime = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updateTime = LocalDateTime.now();
    }
}