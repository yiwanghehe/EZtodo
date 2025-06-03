package com.ywtodo.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegistrationRequest {
    @NotBlank(message = "用户名是必须的")
    private String username;

    @NotBlank(message = "邮箱是必须的")
    @Email
    private String email;

    @NotBlank(message = "密码是必须的")
    @Size(min = 8, message = "密码长度必须大于等于8")
    private String password;
}
