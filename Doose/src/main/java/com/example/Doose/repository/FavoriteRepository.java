package com.example.Doose.repository;

import com.example.Doose.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    Optional<Favorite> findByUserIdAndPortfolioItemId(Long userId, Long portfolioItemId);
    void deleteByUserIdAndPortfolioItemId(Long userId, Long portfolioItemId);
    void deleteByPortfolioItemId(Long portfolioItemId);
}
