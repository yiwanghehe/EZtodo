package com.ywtodo.backend.service;

import com.ywtodo.backend.dto.UserRegistrationRequest;
import com.ywtodo.backend.dto.UserRegistrationResponse;
import com.ywtodo.backend.model.Result;
import com.ywtodo.backend.model.User;

public interface UserService {
    Result<UserRegistrationResponse> registerUser(UserRegistrationRequest registrationRequest);
    // Other user-related methods
}
