package com.example.Doose.service;

import com.example.Doose.model.PortfolioItem;
import com.example.Doose.store.DataStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final DataStore dataStore;

    public List<PortfolioItem> getAll() {
        return dataStore.portfolio;
    }

    public PortfolioItem create(PortfolioItem item) {
        item.setId(dataStore.nextPortfolioId());
        item.setFavoritesCount(item.getFavoritesCount() != null ? item.getFavoritesCount() : 0);
        item.setCreatedAt(LocalDateTime.now());
        dataStore.portfolio.add(item);
        return item;
    }

    public PortfolioItem update(Long id, PortfolioItem updated) {
        PortfolioItem existing = findById(id);
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setSize(updated.getSize());
        if (updated.getImageBase64() != null && !updated.getImageBase64().isBlank()) {
            existing.setImageBase64(updated.getImageBase64());
        }
        return existing;
    }

    public void delete(Long id) {
        dataStore.portfolio.removeIf(p -> p.getId().equals(id));
        dataStore.favorites.removeIf(f -> f.getPortfolioItemId().equals(id));
    }

    public Optional<PortfolioItem> getMostFavoritedThisWeek() {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        return dataStore.portfolio.stream()
                .filter(p -> p.getCreatedAt().isAfter(weekAgo))
                .max(Comparator.comparingInt(PortfolioItem::getFavoritesCount));
    }

    public PortfolioItem findById(Long id) {
        return dataStore.portfolio.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ítem de portafolio no encontrado"));
    }
}
