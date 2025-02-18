package com.oldri.laptopinventory.repository;

import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.model.enums.Department;
import com.oldri.laptopinventory.model.enums.UserRole;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
        Optional<User> findByUsername(String username);

        Optional<User> findByEmail(String email);

        boolean existsByUsername(String username);

        boolean existsByEmail(String email);

        // New methods
        Page<User> findByRole(UserRole role, Pageable pageable);

        Page<User> findByRoleAndIsActiveTrue(UserRole role, Pageable pageable);

        Page<User> findByIsActiveTrue(Pageable pageable);

        List<User> findByDepartment(Department department);

        // For searching users
        @Query("SELECT u FROM User u WHERE " +
                        "(:role IS NULL OR u.role = :role) AND " +
                        "(:department IS NULL OR u.department = :department) AND " +
                        "(:search IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')))")
        Page<User> searchUsers(
                        @Param("role") UserRole role,
                        @Param("department") Department department,
                        @Param("search") String search,
                        Pageable pageable);
}