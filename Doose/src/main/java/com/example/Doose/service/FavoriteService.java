package com.example.Doose.service;

import com.example.Doose.model.Favorite;
import com.example.Doose.model.PortfolioItem;
import com.example.Doose.model.User;
import com.example.Doose.repository.FavoriteRepository;
import com.example.Doose.repository.PortfolioItemRepository;
import com.example.Doose.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PortfolioItemRepository portfolioItemRepository;

    public List<PortfolioItem> getFavoritesByUser(Long userId) {
        return favoriteRepository.findByUserId(userId).stream()
                .map(Favorite::getPortfolioItem)
                .toList();
    }

    @Transactional
    public Favorite add(Long userId, Long portfolioItemId) {
        if (favoriteRepository.findByUserIdAndPortfolioItemId(userId, portfolioItemId).isPresent()) {
            throw new RuntimeException("Ya está en favoritos");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        PortfolioItem item = portfolioItemRepository.findById(portfolioItemId)
                .orElseThrow(() -> new RuntimeException("Ítem de portafolio no encontrado"));

        item.setFavoritesCount((item.getFavoritesCount() != null ? item.getFavoritesCount() : 0) + 1);
        portfolioItemRepository.save(item);

        Favorite fav = Favorite.builder()
                .user(user)
                .portfolioItem(item)
                .build();
        return favoriteRepository.save(fav);
    }

    @Transactional
    public void remove(Long userId, Long portfolioItemId) {
        favoriteRepository.deleteByUserIdAndPortfolioItemId(userId, portfolioItemId);
        PortfolioItem item = portfolioItemRepository.findById(portfolioItemId)
                .orElseThrow(() -> new RuntimeException("Ítem de portafolio no encontrado"));
        item.setFavoritesCount(Math.max(0, (item.getFavoritesCount() != null ? item.getFavoritesCount() : 0) - 1));
        portfolioItemRepository.save(item);
    }
}
