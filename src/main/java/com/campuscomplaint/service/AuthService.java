package com.campuscomplaint.service;

import com.campuscomplaint.dto.AuthResponse;
import com.campuscomplaint.dto.LoginRequest;
import com.campuscomplaint.dto.RegisterRequest;
import com.campuscomplaint.entity.User;
import com.campuscomplaint.repository.UserRepository;
import com.campuscomplaint.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        com.campuscomplaint.enums.Role role = request.getRole() != null ? request.getRole() : com.campuscomplaint.enums.Role.STUDENT;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, "Registration Successful", user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid Password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, "Login Successful", user.getRole().name());
    }
}