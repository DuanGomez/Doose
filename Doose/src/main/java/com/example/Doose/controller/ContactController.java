package com.example.Doose.controller;

import com.example.Doose.dto.ApiResponse;
import com.example.Doose.model.ContactMessage;
import com.example.Doose.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessage>> send(@RequestBody ContactMessage message) {
        return ResponseEntity.ok(ApiResponse.ok("Mensaje enviado", contactService.save(message)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ContactMessage>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(contactService.getAll()));
    }
}
