package com.example.Doose.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioItem {
    private Long id;
    private String imageBase64;
    private String description;
    private Double price;
    private String size;
    private Integer favoritesCount;
    private LocalDateTime createdAt;
}
