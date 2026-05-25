package com.example.Doose.repository;

import com.example.Doose.model.PortfolioItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long> {
    List<PortfolioItem> findByCreatedAtAfterOrderByFavoritesCountDesc(LocalDateTime startAt);
}
