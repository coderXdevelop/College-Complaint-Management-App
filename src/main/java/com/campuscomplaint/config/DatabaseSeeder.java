package com.campuscomplaint.config;

import com.campuscomplaint.entity.User;
import com.campuscomplaint.enums.Role;
import com.campuscomplaint.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Faculty (Admin)
        if (!userRepository.existsByEmail("faculty@campus.edu")) {
            User faculty = User.builder()
                    .name("Faculty Admin")
                    .email("faculty@campus.edu")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.FACULTY)
                    .build();
            userRepository.save(faculty);
        }

        // Seed Student
        if (!userRepository.existsByEmail("student@campus.edu")) {
            User student = User.builder()
                    .name("Student User")
                    .email("student@campus.edu")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(student);
        }
    }
}
