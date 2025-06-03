package com.ywtodo.backend.service.impl;

import com.ywtodo.backend.dto.UserRegistrationRequest;
//import com.ywtodo.backend.exception.UserAlreadyExistsException;
import com.ywtodo.backend.dto.UserRegistrationResponse;
import com.ywtodo.backend.exception.UserAlreadyExistsException;
import com.ywtodo.backend.model.Result;
import com.ywtodo.backend.model.User;
import com.ywtodo.backend.repository.UserRepository;
import com.ywtodo.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository , PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional // 事务确保操作的原子性
    public Result<UserRegistrationResponse> registerUser(UserRegistrationRequest registrationRequest) {
        if (userRepository.existsByUsername(registrationRequest.getUsername())) {
//            return Result.badRequest("用户名" + registrationRequest.getUsername() + "已被使用，请选择其他用户名。");
            // 抛出自定义异常，稍后实现UserAlreadyExistsException
            throw new UserAlreadyExistsException("用户名" + registrationRequest.getUsername() + "已被使用，请选择其他用户名。");
        }
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
//            return Result.badRequest("邮箱" + registrationRequest.getEmail() + "已被使用，请选择其他邮箱。");
            throw new UserAlreadyExistsException("邮箱" + registrationRequest.getEmail() + "已被使用，请选择其他邮箱。");
        }

        try{
            User newUser = new User();
            newUser.setUsername(registrationRequest.getUsername());
            newUser.setEmail(registrationRequest.getEmail());
            newUser.setPasswordHash(passwordEncoder.encode(registrationRequest.getPassword()));
            userRepository.save(newUser);

            return Result.created("用户注册成功", mapToUserRegistrationResponse(newUser));
        } catch (Exception e) {
            return Result.fail("注册失败，发生错误" + e.getMessage());
        }
    }
    private UserRegistrationResponse mapToUserRegistrationResponse(User user) {
        UserRegistrationResponse response = new UserRegistrationResponse();
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
