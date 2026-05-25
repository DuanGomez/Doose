package com.example.Doose.service;

import com.example.Doose.model.TattooService;
import com.example.Doose.repository.TattooServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TattooServiceService {

    private final TattooServiceRepository tattooServiceRepository;

    public List<TattooService> getAll() {
        return tattooServiceRepository.findAll();
    }

    public TattooService create(TattooService service) {
        service.setCreatedAt(LocalDateTime.now());
        return tattooServiceRepository.save(service);
    }

    public TattooService update(Long id, TattooService updated) {
        TattooService existing = findById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setImageBase64(updated.getImageBase64());
        existing.setPrice(updated.getPrice());
        existing.setDuration(updated.getDuration());
        existing.setType(updated.getType());
        return tattooServiceRepository.save(existing);
    }

    public void delete(Long id) {
        tattooServiceRepository.deleteById(id);
    }

    private TattooService findById(Long id) {
        return tattooServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
    }
}
