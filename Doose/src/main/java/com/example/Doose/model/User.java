package com.example.Doose.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    private Long id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private LocalDateTime createdAt;
    private String specialty;
    private Integer experience;

    public enum Role { ADMIN, USER, TATTOER }
}
