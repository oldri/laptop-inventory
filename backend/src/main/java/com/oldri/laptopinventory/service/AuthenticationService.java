package com.oldri.laptopinventory.service;

import com.oldri.laptopinventory.dto.auth.AuthenticationRequest;
import com.oldri.laptopinventory.dto.auth.AuthenticationResponse;
import com.oldri.laptopinventory.dto.device.DeviceDTO;
import com.oldri.laptopinventory.dto.user.UserCreateDTO;
import com.oldri.laptopinventory.dto.user.UserDTO;
import com.oldri.laptopinventory.dto.warranty.WarrantyDTO;
import com.oldri.laptopinventory.exception.AuthenticationException;
import com.oldri.laptopinventory.exception.UserException;
import com.oldri.laptopinventory.model.Device;
import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.model.Warranty;
import com.oldri.laptopinventory.repository.UserRepository;
import com.oldri.laptopinventory.security.jwt.JwtService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
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
                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getUsername(),
                                                        request.getPassword()));

                        User user = userRepository.findByUsername(request.getUsername())
                                        .orElseThrow(() -> new AuthenticationException(
                                                        AuthenticationException.ErrorType.INVALID_CREDENTIALS,
                                                        "Invalid credentials"));

                        user.updateLastLoginTime();
                        user.resetFailedAttempts();
                        userRepository.save(user);

                        String jwtToken = jwtService
                                        .generateToken(userDetailsService.loadUserByUsername(user.getUsername()));

                        return AuthenticationResponse.builder()
                                        .token(jwtToken)
                                        .user(convertToUserDTO(user, true))
                                        .build();
                } catch (BadCredentialsException e) {
                        throw new AuthenticationException(
                                        AuthenticationException.ErrorType.INVALID_CREDENTIALS,
                                        "Invalid username or password");
                }
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
                                .user(convertToUserDTO(savedUser, true))
                                .build();
        }

        private void validateNewUser(UserCreateDTO userCreateDTO) {
                if (userRepository.existsByUsername(userCreateDTO.getUsername())) {
                        throw new UserException(
                                        UserException.ErrorType.USERNAME_ALREADY_EXISTS,
                                        "Username '" + userCreateDTO.getUsername() + "' is already taken");
                }
                if (userRepository.existsByEmail(userCreateDTO.getEmail())) {
                        throw new UserException(
                                        UserException.ErrorType.EMAIL_ALREADY_EXISTS,
                                        "Email '" + userCreateDTO.getEmail() + "' is already registered");
                }
                validatePassword(userCreateDTO.getPassword());
        }

        private void validatePassword(String password) {
                if (password.length() < 8) {
                        throw new AuthenticationException(
                                        AuthenticationException.ErrorType.INVALID_PASSWORD,
                                        "Password must be at least 8 characters long");
                }
                if (!password.matches(".*[A-Z].*")) {
                        throw new AuthenticationException(
                                        AuthenticationException.ErrorType.INVALID_PASSWORD,
                                        "Password must contain at least one uppercase letter");
                }
                if (!password.matches(".*[a-z].*")) {
                        throw new AuthenticationException(
                                        AuthenticationException.ErrorType.INVALID_PASSWORD,
                                        "Password must contain at least one lowercase letter");
                }
                if (!password.matches(".*\\d.*")) {
                        throw new AuthenticationException(
                                        AuthenticationException.ErrorType.INVALID_PASSWORD,
                                        "Password must contain at least one number");
                }
                if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*")) {
                        throw new AuthenticationException(
                                        AuthenticationException.ErrorType.INVALID_PASSWORD,
                                        "Password must contain at least one special character");
                }
        }

        private UserDTO convertToUserDTO(User user, boolean includeDevices) {
                UserDTO userDTO = UserDTO.builder()
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

                if (includeDevices) {
                        List<DeviceDTO> deviceDTOs = user.getAssignedDevices().stream()
                                        .map(device -> convertToDeviceDTO(device, false))
                                        .collect(Collectors.toList());
                        userDTO.setAssignedDevices(deviceDTOs);
                }

                return userDTO;
        }

        private DeviceDTO convertToDeviceDTO(Device device, boolean includeUser) {
                DeviceDTO.DeviceDTOBuilder builder = DeviceDTO.builder()
                                .id(device.getId())
                                .serialNumber(device.getSerialNumber())
                                .modelName(device.getModelName())
                                .manufacturer(device.getManufacturer())
                                .status(device.getStatus())
                                .condition(device.getCondition())
                                .location(device.getLocation())
                                .purchaseDate(device.getPurchaseDate())
                                .warranties(device.getWarranties().stream()
                                                .map(this::convertToWarrantyDTO)
                                                .collect(Collectors.toList()))
                                .createTime(device.getCreateTime())
                                .updateTime(device.getUpdateTime());

                if (includeUser && device.getAssignedUser() != null) {
                        builder.assignedUser(convertToUserDTO(device.getAssignedUser(), false));
                }

                return builder.build();
        }

        private WarrantyDTO convertToWarrantyDTO(Warranty warranty) {
                return WarrantyDTO.builder()
                                .id(warranty.getId())
                                .warrantyId(warranty.getWarrantyId())
                                .startDate(warranty.getStartDate())
                                .endDate(warranty.getEndDate())
                                .type(warranty.getType())
                                .description(warranty.getDescription())
                                .createTime(warranty.getCreateTime())
                                .updateTime(warranty.getUpdateTime())
                                .build();
        }
}