package com.example.Doose.service;

import com.example.Doose.model.PortfolioItem;
import com.example.Doose.repository.FavoriteRepository;
import com.example.Doose.repository.PortfolioItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioItemRepository portfolioItemRepository;
    private final FavoriteRepository favoriteRepository;

    public List<PortfolioItem> getAll() {
        return portfolioItemRepository.findAll();
    }

    public PortfolioItem create(PortfolioItem item) {
        item.setFavoritesCount(item.getFavoritesCount() != null ? item.getFavoritesCount() : 0);
        item.setCreatedAt(LocalDateTime.now());
        return portfolioItemRepository.save(item);
    }

    public PortfolioItem update(Long id, PortfolioItem updated) {
        PortfolioItem existing = findById(id);
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setSize(updated.getSize());
        if (updated.getImageBase64() != null && !updated.getImageBase64().isBlank()) {
            existing.setImageBase64(updated.getImageBase64());
        }
        return portfolioItemRepository.save(existing);
    }

    public void delete(Long id) {
        favoriteRepository.deleteByPortfolioItemId(id);
        portfolioItemRepository.deleteById(id);
    }

    public Optional<PortfolioItem> getMostFavoritedThisWeek() {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        return portfolioItemRepository.findByCreatedAtAfterOrderByFavoritesCountDesc(weekAgo)
                .stream()
                .findFirst();
    }

    public PortfolioItem findById(Long id) {
        return portfolioItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ítem de portafolio no encontrado"));
    }
}
