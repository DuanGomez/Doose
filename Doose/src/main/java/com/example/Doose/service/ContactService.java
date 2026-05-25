package com.example.Doose.service;

import com.example.Doose.model.ContactMessage;
import com.example.Doose.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessage save(ContactMessage message) {
        message.setCreatedAt(java.time.LocalDateTime.now());
        return contactMessageRepository.save(message);
    }

    public List<ContactMessage> getAll() {
        return contactMessageRepository.findAll();
    }
}
