package com.oldri.laptopinventory.security.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.oldri.laptopinventory.exception.ResourceNotFoundException;
import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.repository.UserRepository;

@Component
public class SecurityUtility {

    /**
     * Retrieves the username of the currently authenticated user.
     *
     * @return the username of the current user.
     * @throws IllegalStateException if no user is authenticated.
     */
    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        throw new IllegalStateException("No authenticated user found");
    }

    /**
     * Retrieves the ID of the currently authenticated user.
     *
     * @param userRepository the repository to fetch the user entity.
     * @return the ID of the current user.
     * @throws ResourceNotFoundException if the user is not found in the database.
     */
    public static Long getCurrentUserId(UserRepository userRepository) {
        String username = getCurrentUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }

    /**
     * Retrieves the currently authenticated user entity.
     *
     * @param userRepository the repository to fetch the user entity.
     * @return the current user entity.
     * @throws ResourceNotFoundException if the user is not found in the database.
     */
    public static User getCurrentUser(UserRepository userRepository) {
        String username = getCurrentUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}