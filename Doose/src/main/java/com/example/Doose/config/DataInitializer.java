package com.example.Doose.config;

import com.example.Doose.model.User;
import com.example.Doose.store.DataStore;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final DataStore dataStore;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        User admin = User.builder()
                .id(dataStore.nextUserId())
                .name("AdminDuSe")
                .email("admin@gmail.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .createdAt(java.time.LocalDateTime.now())
                .build();
        dataStore.users.add(admin);
    }                   

    @PostConstruct
    public void initUsers() {
        User userDuan = User.builder()
                .id(dataStore.nextUserId())
                .name("Duan")
                .email("duan@gmail.com")
                .password(passwordEncoder.encode("duan123"))
                .role(User.Role.USER)
                .createdAt(java.time.LocalDateTime.now())
                .build();
        dataStore.users.add(userDuan);
    }
}
