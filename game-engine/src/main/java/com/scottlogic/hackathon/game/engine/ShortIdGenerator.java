package com.scottlogic.hackathon.game.engine;

import com.scottlogic.hackathon.game.Id;


import java.util.concurrent.atomic.AtomicLong;

public class ShortIdGenerator {

    AtomicLong lastId = new AtomicLong();

    public Id next(){
        return new Id(lastId.incrementAndGet());
    }

}
