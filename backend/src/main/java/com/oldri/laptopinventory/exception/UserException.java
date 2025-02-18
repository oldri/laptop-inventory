package com.oldri.laptopinventory.exception;

public class UserException extends RuntimeException {
    public enum ErrorType {
        USER_NOT_FOUND,
        USERNAME_ALREADY_EXISTS,
        EMAIL_ALREADY_EXISTS,
        INVALID_USER_OPERATION
    }

    private final ErrorType errorType;

    public UserException(ErrorType errorType, String message) {
        super(message);
        this.errorType = errorType;
    }

    public ErrorType getErrorType() {
        return errorType;
    }
}