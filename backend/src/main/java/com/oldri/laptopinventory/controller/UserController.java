package com.oldri.laptopinventory.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.oldri.laptopinventory.dto.user.UserCreateDTO;
import com.oldri.laptopinventory.dto.user.UserDTO;
import com.oldri.laptopinventory.dto.user.UserUpdateDTO;
import com.oldri.laptopinventory.model.enums.Department;
import com.oldri.laptopinventory.model.enums.UserRole;
import com.oldri.laptopinventory.security.utils.SecurityUtility;
import com.oldri.laptopinventory.service.UserService;
import org.springframework.web.bind.annotation.RequestBody;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
        private final UserService userService;

        @PostMapping
        public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateDTO userCreateDTO) {
                UserDTO createdUser = userService.createUser(userCreateDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        }

        @GetMapping
        public ResponseEntity<Page<UserDTO>> getUsers(Pageable pageable) {
                return ResponseEntity.ok(userService.getUsers(pageable));
        }

        @GetMapping("/{id}")
        public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
                return ResponseEntity.ok(userService.getUserById(id));
        }

        @PutMapping("/{id}")
        public ResponseEntity<UserDTO> updateUser(
                        @PathVariable Long id,
                        @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
                return ResponseEntity.ok(userService.updateUser(id, userUpdateDTO));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
                userService.deleteUser(id);
                return ResponseEntity.noContent().build();
        }

        @GetMapping("/profile")
        public ResponseEntity<UserDTO> getCurrentUserProfile() {
                return ResponseEntity.ok(userService.getUserByUsername(SecurityUtility.getCurrentUsername()));
        }

        @GetMapping("/search")
        public ResponseEntity<Page<UserDTO>> searchUsers(
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) UserRole role,
                        @RequestParam(required = false) Department department,
                        @PageableDefault(size = 10) Pageable pageable) {
                return ResponseEntity.ok(userService.searchUsers(search, role, department, pageable));
        }
}