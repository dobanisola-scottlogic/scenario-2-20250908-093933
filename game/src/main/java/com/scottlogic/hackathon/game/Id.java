package com.scottlogic.hackathon.game;


import lombok.AllArgsConstructor;
import lombok.Value;

import java.io.Serializable;

@Value
@AllArgsConstructor
public class Id implements Serializable {

    private Long id;

    @Override
    public String toString() {
        return String.valueOf(id);
    }
}
