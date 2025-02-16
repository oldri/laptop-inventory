package com.oldri.laptopinventory.security.utils;

import com.oldri.laptopinventory.model.enums.UserRole;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;


public class RoleUtility {

    public static boolean isAdmin() {
        boolean result = hasRole(UserRole.ROLE_ADMIN);
        return result;
    }

    public static boolean isSuperAdmin() {
        boolean result = hasRole(UserRole.ROLE_SUPER_ADMIN);
        return result;
    }

    public static boolean isSuperAdminOrAdmin() {
        boolean result = isSuperAdmin() || isAdmin();
        return result;
    }

    public static boolean isEmployee() {
        boolean result = hasRole(UserRole.ROLE_EMPLOYEE);
        return result;
    }

    private static boolean hasRole(UserRole role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            boolean result = userDetails.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(role.name()));
            return result;
        }
        return false;
    }
}