package com.oldri.laptopinventory.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AuthenticationException extends RuntimeException {
    private final ErrorType errorType;

    public AuthenticationException(ErrorType errorType, String message) {
        super(message);
        this.errorType = errorType;
    }

    public ErrorType getErrorType() {
        return errorType;
    }

    public enum ErrorType {
        INVALID_CREDENTIALS,
        USERNAME_ALREADY_EXISTS,
        EMAIL_ALREADY_EXISTS,
        INVALID_PASSWORD,
        USER_NOT_FOUND
    }
}