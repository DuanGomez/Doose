package com.example.Doose.service;

import com.example.Doose.model.ContactMessage;
import com.example.Doose.store.DataStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final DataStore dataStore;

    public ContactMessage save(ContactMessage message) {
        message.setId(dataStore.nextMessageId());
        message.setCreatedAt(java.time.LocalDateTime.now());
        dataStore.messages.add(message);
        return message;
    }

    public List<ContactMessage> getAll() {
        return dataStore.messages;
    }
}
