package com.oldri.laptopinventory.model.enums;

public enum WarrantyStatus {
    PENDING("Not Yet Active"),
    ACTIVE("Active"),
    EXPIRED("Expired");

    private final String description;

    WarrantyStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}