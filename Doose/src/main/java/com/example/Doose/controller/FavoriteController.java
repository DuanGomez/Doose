package com.example.Doose.controller;

import com.example.Doose.dto.ApiResponse;
import com.example.Doose.model.PortfolioItem;
import com.example.Doose.service.FavoriteService;
import com.example.Doose.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PortfolioItem>>> getMyFavorites(@AuthenticationPrincipal UserDetails ud) {
        Long userId = userService.findByEmail(ud.getUsername()).getId();
        return ResponseEntity.ok(ApiResponse.ok(favoriteService.getFavoritesByUser(userId)));
    }

    @PostMapping("/{portfolioItemId}")
    public ResponseEntity<ApiResponse<Void>> add(@PathVariable Long portfolioItemId,
                                                  @AuthenticationPrincipal UserDetails ud) {
        Long userId = userService.findByEmail(ud.getUsername()).getId();
        favoriteService.add(userId, portfolioItemId);
        return ResponseEntity.ok(ApiResponse.ok("Agregado a favoritos", null));
    }

    @DeleteMapping("/{portfolioItemId}")
    public ResponseEntity<ApiResponse<Void>> remove(@PathVariable Long portfolioItemId,
                                                     @AuthenticationPrincipal UserDetails ud) {
        Long userId = userService.findByEmail(ud.getUsername()).getId();
        favoriteService.remove(userId, portfolioItemId);
        return ResponseEntity.ok(ApiResponse.ok("Eliminado de favoritos", null));
    }
}
