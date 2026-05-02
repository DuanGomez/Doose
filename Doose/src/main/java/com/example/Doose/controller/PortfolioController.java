package com.example.Doose.controller;

import com.example.Doose.dto.ApiResponse;
import com.example.Doose.model.PortfolioItem;
import com.example.Doose.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PortfolioItem>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(portfolioService.getAll()));
    }

    @GetMapping("/stat/top-week")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Optional<PortfolioItem>>> topOfWeek() {
        return ResponseEntity.ok(ApiResponse.ok(portfolioService.getMostFavoritedThisWeek()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PortfolioItem>> create(@RequestBody PortfolioItem item) {
        return ResponseEntity.ok(ApiResponse.ok(portfolioService.create(item)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PortfolioItem>> update(@PathVariable Long id, @RequestBody PortfolioItem item) {
        return ResponseEntity.ok(ApiResponse.ok(portfolioService.update(id, item)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        portfolioService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Ítem eliminado", null));
    }
}
