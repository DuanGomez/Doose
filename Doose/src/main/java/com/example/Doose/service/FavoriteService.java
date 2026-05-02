package com.example.Doose.service;

import com.example.Doose.model.Favorite;
import com.example.Doose.model.PortfolioItem;
import com.example.Doose.store.DataStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final DataStore dataStore;
    private final PortfolioService portfolioService;

    public List<PortfolioItem> getFavoritesByUser(Long userId) {
        return dataStore.favorites.stream()
                .filter(f -> f.getUserId().equals(userId))
                .map(f -> portfolioService.findById(f.getPortfolioItemId()))
                .toList();
    }

    public Favorite add(Long userId, Long portfolioItemId) {
        boolean exists = dataStore.favorites.stream()
                .anyMatch(f -> f.getUserId().equals(userId) && f.getPortfolioItemId().equals(portfolioItemId));
        if (exists) throw new RuntimeException("Ya está en favoritos");

        PortfolioItem item = portfolioService.findById(portfolioItemId);
        item.setFavoritesCount((item.getFavoritesCount() != null ? item.getFavoritesCount() : 0) + 1);

        Favorite fav = Favorite.builder()
                .id(dataStore.nextFavoriteId())
                .userId(userId)
                .portfolioItemId(portfolioItemId)
                .createdAt(java.time.LocalDateTime.now())
                .build();
        dataStore.favorites.add(fav);
        return fav;
    }

    public void remove(Long userId, Long portfolioItemId) {
        boolean removed = dataStore.favorites.removeIf(
                f -> f.getUserId().equals(userId) && f.getPortfolioItemId().equals(portfolioItemId));
        if (removed) {
            PortfolioItem item = portfolioService.findById(portfolioItemId);
            item.setFavoritesCount(Math.max(0, (item.getFavoritesCount() != null ? item.getFavoritesCount() : 0) - 1));
        }
    }
}
