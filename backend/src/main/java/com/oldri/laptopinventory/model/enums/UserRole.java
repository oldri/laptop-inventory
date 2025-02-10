package com.oldri.laptopinventory.model.enums;

public enum UserRole {
    ADMIN("Admin"),
    SUPER_ADMIN("Super Admin"),
    EMPLOYEE("Employee");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}