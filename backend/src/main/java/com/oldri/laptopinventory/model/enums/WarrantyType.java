package com.oldri.laptopinventory.model.enums;

public enum WarrantyType {
    STANDARD("Standard Warranty"),
    EXTENDED("Extended Warranty"),
    PREMIUM("Premium Warranty"),
    THIRD_PARTY("Third Party Warranty");

    private final String description;

    WarrantyType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}