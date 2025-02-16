package com.oldri.laptopinventory.model.enums;

public enum UserRole {
    ROLE_ADMIN("Admin"),
    ROLE_SUPER_ADMIN("Super Admin"),
    ROLE_EMPLOYEE("Employee");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}