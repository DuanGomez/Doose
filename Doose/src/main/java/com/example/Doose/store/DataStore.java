package com.example.Doose.store;

import com.example.Doose.model.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class DataStore {

    public final List<User> users = new ArrayList<>();
    public final List<TattooService> services = new ArrayList<>();
    public final List<PortfolioItem> portfolio = new ArrayList<>();
    public final List<Favorite> favorites = new ArrayList<>();
    public final List<ContactMessage> messages = new ArrayList<>();

    private final AtomicLong userSeq     = new AtomicLong(1);
    private final AtomicLong serviceSeq  = new AtomicLong(1);
    private final AtomicLong portfolioSeq= new AtomicLong(1);
    private final AtomicLong favoriteSeq = new AtomicLong(1);
    private final AtomicLong messageSeq  = new AtomicLong(1);

    public long nextUserId()      { return userSeq.getAndIncrement(); }
    public long nextServiceId()   { return serviceSeq.getAndIncrement(); }
    public long nextPortfolioId() { return portfolioSeq.getAndIncrement(); }
    public long nextFavoriteId()  { return favoriteSeq.getAndIncrement(); }
    public long nextMessageId()   { return messageSeq.getAndIncrement(); }
}
