package com.oldri.laptopinventory.model.enums;

public enum RequestPriority {
    LOW("Low Priority"),
    MEDIUM("Medium Priority"),
    HIGH("High Priority"),
    URGENT("Urgent");

    private final String description;

    RequestPriority(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
