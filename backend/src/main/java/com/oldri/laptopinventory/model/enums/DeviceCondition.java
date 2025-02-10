package com.oldri.laptopinventory.model.enums;

public enum DeviceCondition {
    NEW("Brand New"),
    USED("Used"),
    REFURBISHED("Refurbished"),
    DAMAGED("Damaged");

    private final String description;

    DeviceCondition(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}