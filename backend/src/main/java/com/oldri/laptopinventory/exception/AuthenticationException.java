package com.oldri.laptopinventory.exception;

public class AuthenticationException extends RuntimeException {

    public enum ErrorType {
        INVALID_CREDENTIALS,
        INVALID_PASSWORD,
        ACCOUNT_DISABLED
    }

    private final ErrorType errorType;

    public AuthenticationException(ErrorType errorType, String message) {
        super(message);
        this.errorType = errorType;
    }

    public ErrorType getErrorType() {
        return errorType;
    }
}