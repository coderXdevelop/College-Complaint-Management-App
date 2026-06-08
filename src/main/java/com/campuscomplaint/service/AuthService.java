package com.campuscomplaint.service;

import com.campuscomplaint.dto.AuthResponse;
import com.campuscomplaint.dto.LoginRequest;
import com.campuscomplaint.dto.RegisterRequest;
import com.campuscomplaint.entity.User;
import com.campuscomplaint.repository.UserRepository;
import com.campuscomplaint.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email already exists - {}", request.getEmail());
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);
        log.info("User registered successfully: {}", request.getEmail());

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, "Registration Successful");
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: User not found - {}", request.getEmail());
                    return new RuntimeException("User not found");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: Invalid password for user - {}", request.getEmail());
            throw new RuntimeException("Invalid Password");
        }

        log.info("User logged in successfully: {}", request.getEmail());
        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, "Login Successful");
    }
}