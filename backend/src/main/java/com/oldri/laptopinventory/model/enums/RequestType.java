package com.oldri.laptopinventory.model.enums;

public enum RequestType {
    NEW_DEVICE("New Device"),
    DEVICE_ASSIGNMENT("Device Assignment");

    private final String description;

    RequestType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}