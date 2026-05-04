package com.example.Doose.controller;

import com.example.Doose.dto.ApiResponse;
import com.example.Doose.dto.TattoerProfileRequest;
import com.example.Doose.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(
            @RequestBody TattoerProfileRequest req,
            Principal principal) {
        userService.updateProfile(principal.getName(), req.getSpecialty(), req.getExperience());
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
