package com.example.authsystem.service;

import com.example.authsystem.dto.*;
import com.example.authsystem.entity.User;
import com.example.authsystem.repository.UserRepository;
import com.example.authsystem.security.JwtUtil;
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
        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        
        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        userRepository.save(user);
        
        return new AuthResponse(null, user.getUsername(), "Đăng ký thành công");
    }
    
    public AuthResponse login(LoginRequest request) {
        // Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng"));
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername());
        
        return new AuthResponse(token, user.getUsername(), "Đăng nhập thành công");
    }
}



