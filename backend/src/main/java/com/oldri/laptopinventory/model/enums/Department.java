package com.oldri.laptopinventory.model.enums;

public enum Department {
    HR("Human Resources"),
    TECH("Technology"),
    CONSULTING("Consulting"),
    MANAGEMENT("Management"),
    FINANCE("Finance"),
    OPERATIONS("Operations");

    private final String description;

    Department(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
