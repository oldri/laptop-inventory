package com.oldri.laptopinventory.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // GlobalExceptionHandler.java
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAuthenticationException(
            AuthenticationException ex, WebRequest request) {
        // Remove USERNAME_ALREADY_EXISTS and USER_NOT_FOUND from this handler
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("errorType", ex.getErrorType());

        HttpStatus status = HttpStatus.BAD_REQUEST;

        switch (ex.getErrorType()) {
            case INVALID_CREDENTIALS:
                status = HttpStatus.UNAUTHORIZED;
                break;
            case INVALID_PASSWORD:
                status = HttpStatus.BAD_REQUEST;
                break;
            case ACCOUNT_DISABLED:
                status = HttpStatus.FORBIDDEN;
                break;
        }

        return new ResponseEntity<>(body, status);
    }

    @ExceptionHandler(UserException.class)
    public ResponseEntity<Object> handleUserException(
            UserException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("errorType", ex.getErrorType());

        HttpStatus status = HttpStatus.BAD_REQUEST;

        switch (ex.getErrorType()) {
            case USER_NOT_FOUND:
                status = HttpStatus.NOT_FOUND;
                break;
            case USERNAME_ALREADY_EXISTS:
            case EMAIL_ALREADY_EXISTS:
                status = HttpStatus.CONFLICT;
                break;
            case INVALID_USER_OPERATION:
                status = HttpStatus.FORBIDDEN;
                break;
        }

        return new ResponseEntity<>(body, status);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(
            Exception ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "An unexpected error occurred");

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}