package com.oldri.laptopinventory.security.utils;

import com.oldri.laptopinventory.model.enums.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class RoleUtility {

    public static boolean isAdmin() {
        return hasRole(UserRole.ROLE_ADMIN);
    }

    public static boolean isSuperAdmin() {
        return hasRole(UserRole.ROLE_SUPER_ADMIN);
    }

    public static boolean isSuperAdminOrAdmin() {
        return isSuperAdmin() || isAdmin();
    }

    public static boolean isEmployee() {
        return hasRole(UserRole.ROLE_EMPLOYEE);
    }

    private static boolean hasRole(UserRole role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null
                && authentication.getPrincipal() instanceof UserDetails
                && ((UserDetails) authentication.getPrincipal()).getAuthorities().stream()
                        .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(role.name()));
    }
}