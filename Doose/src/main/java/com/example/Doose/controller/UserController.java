package com.example.Doose.controller;

import com.example.Doose.dto.ApiResponse;
import com.example.Doose.model.User;
import com.example.Doose.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(userService.getAll()));
    }

    @GetMapping("/tattoers")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<ApiResponse<List<User>>> getTattoers() {
    return ResponseEntity.ok(ApiResponse.ok(userService.getTattoers()));
}
}
