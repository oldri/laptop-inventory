package com.oldri.laptopinventory.model.enums;

public enum DeviceLocation {
    OFFICE_HQ("Headquarters"),
    OFFICE_BRANCH("Branch Office"),
    WAREHOUSE("Warehouse"),
    WITH_EMPLOYEE("With Employee"),
    IN_TRANSIT("In Transit");

    private final String description;

    DeviceLocation(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}