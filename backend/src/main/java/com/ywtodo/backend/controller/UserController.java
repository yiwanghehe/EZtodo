package com.ywtodo.backend.controller;

import com.ywtodo.backend.dto.JwtResponse;
import com.ywtodo.backend.dto.LoginRequest;
import com.ywtodo.backend.dto.UserRegistrationRequest;
import com.ywtodo.backend.dto.UserRegistrationResponse;
import com.ywtodo.backend.model.Result;
import com.ywtodo.backend.security.JwtTokenProvider;
import com.ywtodo.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Autowired
    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<Result<UserRegistrationResponse>> registerUser(@Valid @RequestBody UserRegistrationRequest registrationRequest) {
        Result<UserRegistrationResponse> registrationResult = userService.registerUser(registrationRequest);
        if (registrationResult.isCreated()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(registrationResult);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(registrationResult);
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), // Or getUsername() if you use username for login
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            // Assuming UserPrincipal has getId() and getUsername()
            Long userId = ((com.ywtodo.backend.security.UserPrincipal) userDetails).getId();
            String username = userDetails.getUsername();

            Result<JwtResponse> loginResult = Result.success("登录成功", new JwtResponse(jwt, userId, username));
            return ResponseEntity.status(HttpStatus.OK).body(loginResult);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("登录失败：用户名或密码错误"));
        }
    }
}
