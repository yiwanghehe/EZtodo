package com.ywtodo.backend.exception;

import com.ywtodo.backend.model.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 处理自定义的 ResourceNotFoundException
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseBody
    public ResponseEntity<Result<Object>> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        logger.warn("无法找到资源: {}", ex.getMessage());
        Result<Object> errorResult = Result.notFound(ex.getMessage());
        return new ResponseEntity<>(errorResult, HttpStatus.NOT_FOUND);
    }

    // 处理自定义的 UserAlreadyExistsException
    @ExceptionHandler(UserAlreadyExistsException.class)
    @ResponseBody
    public ResponseEntity<Result<Object>> handleUserAlreadyExistsException(UserAlreadyExistsException ex, WebRequest request) {
        logger.warn("用户已存在: {}", ex.getMessage());
        Result<Object> errorResult = Result.badRequest(ex.getMessage());
        return new ResponseEntity<>(errorResult, HttpStatus.BAD_REQUEST);
    }

    // 处理 @Valid 参数校验失败
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public ResponseEntity<Result<Object>> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        logger.warn("验证错误: {}", errors);
        Result<Object> errorResult = Result.fail(HttpStatus.BAD_REQUEST.value(), "验证错误: " + errors);
        return new ResponseEntity<>(errorResult, HttpStatus.BAD_REQUEST);
    }

    // Spring Security的 AuthenticationException (虽然JwtAuthenticationEntryPoint会处理，但也可以在这里捕获以防万一或用于其他认证场景)
    // 注意：如果JwtAuthenticationEntryPoint已正确配置并处理，这个可能不会被触发，或者可以用于其他类型的AuthenticationException
    @ExceptionHandler(AuthenticationException.class)
    @ResponseBody
    public ResponseEntity<Result<Object>> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        logger.error("认证错误: {}", ex.getMessage());
        Result<Object> errorResult = Result.unauthorized("认证错误: " + ex.getMessage());
        return new ResponseEntity<>(errorResult, HttpStatus.UNAUTHORIZED);
    }

    // Spring Security的 AccessDeniedException (虽然CustomAccessDeniedHandler会处理，但也可以在这里捕获)
    // 注意：如果CustomAccessDeniedHandler已正确配置并处理，这个可能不会被触发
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseBody
    public ResponseEntity<Result<Object>> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        logger.error("拒绝访问: {}", ex.getMessage());
        Result<Object> errorResult = Result.forbidden("拒绝访问: " + ex.getMessage());
        return new ResponseEntity<>(errorResult, HttpStatus.FORBIDDEN);
    }


    // 处理其他所有未捕获的异常 (通用错误)
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity<Result<Object>> handleAllUncaughtException(Exception ex, WebRequest request) {
        logger.error("出现了不可预料的错误: {}", ex.getMessage(), ex); // Log stack trace for unexpected errors
        Result<Object> errorResult = Result.fail("服务器出现了不可预料的错误. 请稍后再试.");
        return new ResponseEntity<>(errorResult, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
