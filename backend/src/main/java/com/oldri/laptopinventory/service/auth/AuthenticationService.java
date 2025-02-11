package com.oldri.laptopinventory.service.auth;

import com.oldri.laptopinventory.dto.auth.AuthenticationRequest;
import com.oldri.laptopinventory.dto.auth.AuthenticationResponse;
import com.oldri.laptopinventory.dto.user.UserCreateDTO;
import com.oldri.laptopinventory.dto.user.UserDTO;
import com.oldri.laptopinventory.exception.EmailAlreadyExistsException;
import com.oldri.laptopinventory.exception.InvalidPasswordException;
import com.oldri.laptopinventory.exception.UsernameAlreadyExistsException;
import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.repository.UserRepository;
import com.oldri.laptopinventory.security.jwt.JwtService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository userRepository;
        private final JwtService jwtService;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final UserDetailsService userDetailsService;

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getUsername(),
                                                request.getPassword()));

                User user = userRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                user.updateLastLoginTime();
                user.resetFailedAttempts();
                userRepository.save(user);

                String jwtToken = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getUsername()));

                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .user(convertToUserDTO(user))
                                .build();
        }

        public AuthenticationResponse register(UserCreateDTO userCreateDTO) {
                validateNewUser(userCreateDTO);

                User newUser = User.builder()
                                .username(userCreateDTO.getUsername())
                                .password(passwordEncoder.encode(userCreateDTO.getPassword()))
                                .email(userCreateDTO.getEmail())
                                .firstName(userCreateDTO.getFirstName())
                                .lastName(userCreateDTO.getLastName())
                                .phoneNumber(userCreateDTO.getPhoneNumber())
                                .role(userCreateDTO.getRole())
                                .department(userCreateDTO.getDepartment())
                                .build();

                User savedUser = userRepository.save(newUser);

                String jwtToken = jwtService.generateToken(
                                userDetailsService.loadUserByUsername(savedUser.getUsername()));

                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .user(convertToUserDTO(savedUser))
                                .build();
        }

        private void validateNewUser(UserCreateDTO userCreateDTO) {
                if (userRepository.existsByUsername(userCreateDTO.getUsername())) {
                        throw new UsernameAlreadyExistsException(
                                        "Username '" + userCreateDTO.getUsername() + "' is already taken");
                }
                if (userRepository.existsByEmail(userCreateDTO.getEmail())) {
                        throw new EmailAlreadyExistsException(
                                        "Email '" + userCreateDTO.getEmail() + "' is already registered");
                }
                validatePassword(userCreateDTO.getPassword());
        }

        private void validatePassword(String password) {
                if (password.length() < 8) {
                        throw new InvalidPasswordException("Password must be at least 8 characters long");
                }
                if (!password.matches(".*[A-Z].*")) {
                        throw new InvalidPasswordException("Password must contain at least one uppercase letter");
                }
                if (!password.matches(".*[a-z].*")) {
                        throw new InvalidPasswordException("Password must contain at least one lowercase letter");
                }
                if (!password.matches(".*\\d.*")) {
                        throw new InvalidPasswordException("Password must contain at least one number");
                }
                if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*")) {
                        throw new InvalidPasswordException("Password must contain at least one special character");
                }
        }

        private UserDTO convertToUserDTO(User user) {
                return UserDTO.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .phoneNumber(user.getPhoneNumber())
                                .role(user.getRole())
                                .department(user.getDepartment())
                                .isActive(user.isActive())
                                .build();
        }
}

