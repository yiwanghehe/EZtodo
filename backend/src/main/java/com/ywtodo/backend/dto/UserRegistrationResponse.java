package com.ywtodo.backend.dto;
import lombok.Data;

import java.time.Instant;

@Data
public class UserRegistrationResponse {
    private String username;
    private String email;
    private Instant createdAt;
}
