package com.example.Doose.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {
    private Long id;
    private Long userId;
    private Long portfolioItemId;
    private LocalDateTime createdAt;
}
