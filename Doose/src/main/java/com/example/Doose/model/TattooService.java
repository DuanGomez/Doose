package com.example.Doose.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TattooService {
    private Long id;
    private String name;
    private String description;
    private String imageBase64;
    private Double price;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
