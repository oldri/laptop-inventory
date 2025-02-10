package com.oldri.laptopinventory.dto.auth;

import com.oldri.laptopinventory.dto.user.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    private String token;
    private UserDTO user;
}
