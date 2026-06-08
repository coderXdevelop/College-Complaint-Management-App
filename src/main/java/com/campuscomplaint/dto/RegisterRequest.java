package com.campuscomplaint.dto;

import com.campuscomplaint.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "User registration request")
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Schema(description = "User full name", example = "John Doe")
    private String name;

    @Email(message = "Invalid email")
    @Schema(description = "User email address", example = "student@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Schema(description = "User password", example = "password123")
    private String password;

    @Schema(description = "User role", example = "STUDENT")
    private Role role;
}