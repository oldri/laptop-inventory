package com.oldri.laptopinventory.model.enums;

public enum DeviceStatus {
    AVAILABLE("Available"),
    ASSIGNED("Assigned"),
    MAINTENANCE("Maintenance");

    private final String description;

    DeviceStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}