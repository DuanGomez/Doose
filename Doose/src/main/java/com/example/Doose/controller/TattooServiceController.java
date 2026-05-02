package com.example.Doose.controller;

import com.example.Doose.dto.ApiResponse;
import com.example.Doose.model.TattooService;
import com.example.Doose.service.TattooServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class TattooServiceController {

    private final TattooServiceService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TattooService>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAll()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TattooService>> create(@RequestBody TattooService body) {
        return ResponseEntity.ok(ApiResponse.ok(service.create(body)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TattooService>> update(@PathVariable Long id, @RequestBody TattooService body) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, body)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Servicio eliminado", null));
    }
}
