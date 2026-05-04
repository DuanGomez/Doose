package com.example.Doose.service;

import com.example.Doose.model.User;
import com.example.Doose.store.DataStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final DataStore dataStore;

    public List<User> getAll() {
        return dataStore.users.stream()
                .map(u -> {
                    User safe = User.builder()
                            .id(u.getId())
                            .name(u.getName())
                            .email(u.getEmail())
                            .role(u.getRole())
                            .createdAt(u.getCreatedAt())
                            .build();
                    return safe;
                })
                .toList();
    }

  public List<User> getTattoers() {
    return dataStore.users.stream()
            .filter(u -> u.getRole() == User.Role.TATTOER)
            .map(u -> User.builder()
                    .id(u.getId())
                    .name(u.getName())
                    .email(u.getEmail())
                    .role(u.getRole())
                    .createdAt(u.getCreatedAt())
                    .specialty(u.getSpecialty())
                    .experience(u.getExperience())
                    .build())
            .toList();
    }

    public User findByEmail(String email) {
        return dataStore.users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void updateProfile(String email, String specialty, Integer experience) {
        User user = dataStore.users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setSpecialty(specialty);
        user.setExperience(experience);
    }
}
