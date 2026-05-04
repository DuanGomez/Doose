package com.example.Doose.config;

import com.example.Doose.model.User;
import com.example.Doose.model.TattooService;
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

    @PostConstruct
    public void initService(){
        TattooService service1 = TattooService.builder()
                .id(dataStore.nextServiceId())
                .name("Traditional Tattoo")
                .description("Classic designs with bold lines and vibrant colors.")
                .price(150.0)
                .createdAt(java.time.LocalDateTime.now())
                .build();
        dataStore.services.add(service1);
    }

   @PostConstruct
public void initTattoers() {
    User tattoer1 = User.builder()
            .id(dataStore.nextUserId())
            .name("Sebastián Ríos")
            .email("sebastian@tattoo.com")
            .password(passwordEncoder.encode("sebastian123"))
            .role(User.Role.TATTOER)
            .specialty("Realismo & Blackwork")
            .experience(8)
            .createdAt(java.time.LocalDateTime.now())
            .build();
    dataStore.users.add(tattoer1);

    User tattoer2 = User.builder()
            .id(dataStore.nextUserId())
            .name("Valentina Cruz")
            .email("valentina@tattoo.com")
            .password(passwordEncoder.encode("valentina123"))
            .role(User.Role.TATTOER)
            .specialty("Acuarela & Minimalista")
            .experience(5)
            .createdAt(java.time.LocalDateTime.now())
            .build();
    dataStore.users.add(tattoer2);

    User tattoer3 = User.builder()
            .id(dataStore.nextUserId())
            .name("Andrés Montoya")
            .email("andres@tattoo.com")
            .password(passwordEncoder.encode("andres123"))
            .role(User.Role.TATTOER)
            .specialty("Tribal & Geométrico")
            .experience(10)
            .createdAt(java.time.LocalDateTime.now())
            .build();
    dataStore.users.add(tattoer3);
}
}
