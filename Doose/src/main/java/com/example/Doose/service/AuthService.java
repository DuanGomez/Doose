package com.example.Doose.service;

import com.example.Doose.dto.AuthResponse;
import com.example.Doose.dto.LoginRequest;
import com.example.Doose.dto.RegisterRequest;
import com.example.Doose.model.User;
import com.example.Doose.security.JwtUtil;
import com.example.Doose.store.DataStore;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final DataStore dataStore;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        boolean exists = dataStore.users.stream()
                .anyMatch(u -> u.getEmail().equalsIgnoreCase(req.getEmail()));
        if (exists) throw new RuntimeException("El correo ya está registrado");

        User user = User.builder()
                .id(dataStore.nextUserId())
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getEmail().toLowerCase().endsWith("@tattoo.com") ? User.Role.TATTOER : User.Role.USER)
                .createdAt(java.time.LocalDateTime.now())
                .build();

        dataStore.users.add(user);
        String token = jwtUtil.generate(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest req) {
        User user = dataStore.users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(req.getEmail()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        String token = jwtUtil.generate(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
