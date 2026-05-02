package com.example.Doose.service;

import com.example.Doose.model.TattooService;
import com.example.Doose.store.DataStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TattooServiceService {

    private final DataStore dataStore;

    public List<TattooService> getAll() {
        return dataStore.services;
    }

    public TattooService create(TattooService service) {
        service.setId(dataStore.nextServiceId());
        dataStore.services.add(service);
        return service;
    }

    public TattooService update(Long id, TattooService updated) {
        TattooService existing = findById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setImageBase64(updated.getImageBase64());
        return existing;
    }

    public void delete(Long id) {
        dataStore.services.removeIf(s -> s.getId().equals(id));
    }

    private TattooService findById(Long id) {
        return dataStore.services.stream()
                .filter(s -> s.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
    }
}
