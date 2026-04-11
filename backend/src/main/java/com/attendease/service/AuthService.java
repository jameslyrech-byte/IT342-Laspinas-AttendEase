package com.attendease.service;

import com.attendease.dto.AuthResponse;
import com.attendease.dto.LoginRequest;
import com.attendease.dto.RegisterRequest;
import com.attendease.dto.UserDto;
import com.attendease.entity.RefreshToken;
import com.attendease.entity.User;
import com.attendease.entity.UserRole;
import com.attendease.repository.RefreshTokenRepository;
import com.attendease.repository.UserRepository;
import com.attendease.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Transactional
    public UserDto register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setRole(UserRole.valueOf(request.getRole().toUpperCase()));
        
        User savedUser = userRepository.save(user);
        return mapToUserDto(savedUser);
    }
    
    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            if (request.getEmail() == null || request.getPassword() == null) {
                throw new IllegalArgumentException("Email and password are required");
            }
            
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("Email not found"));
            
            if (user.getPasswordHash() == null) {
                throw new IllegalArgumentException("Invalid user account");
            }
            
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                throw new IllegalArgumentException("Invalid password");
            }
            
            try {
                String accessToken = jwtUtil.generateToken(user.getEmail(), user.getId());
                String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
                
                // Save refresh token
                RefreshToken token = new RefreshToken();
                token.setUserId(user.getId());
                token.setToken(refreshToken);
                token.setExpiryDate(LocalDateTime.now().plusDays(7));
                refreshTokenRepository.save(token);
                
                return new AuthResponse(accessToken, refreshToken, mapToUserDto(user));
            } catch (Exception jwtError) {
                throw new RuntimeException("Token generation failed: " + jwtError.getMessage());
            }
        } catch (Exception e) {
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }
    
    private UserDto mapToUserDto(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFirstname(),
                user.getLastname(),
                user.getRole().toString()
        );
    }
}
