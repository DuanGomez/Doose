package com.example.Doose.service;

import com.example.Doose.model.User;
import com.example.Doose.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAll() {
        return userRepository.findAll().stream()
                .map(u -> User.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .role(u.getRole())
                        .createdAt(u.getCreatedAt())
                        .build())
                .toList();
    }

    public List<User> getTattoers() {
        return userRepository.findAll().stream()
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
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void updateProfile(String email, String specialty, Integer experience) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setSpecialty(specialty);
        user.setExperience(experience);
        userRepository.save(user);
    }
}
