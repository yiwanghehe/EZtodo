package com.ywtodo.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ywtodo.backend.model.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;


// JwtAuthenticationEntryPoint 处理当一个未认证的用户尝试访问需要认证的资源时的情况。它会返回一个 401 Unauthorized 响应，并包含错误信息。

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);
    private final ObjectMapper objectMapper = new ObjectMapper(); // Jackson ObjectMapper

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        logger.error("未认证用户错误: {}", authException.getMessage());

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Result<Object> apiError = Result.unauthorized(
                "授权失败，用户未认证: " + authException.getMessage()
        );

        OutputStream out = response.getOutputStream();
        objectMapper.writeValue(out, apiError);
        out.flush();
    }
}
