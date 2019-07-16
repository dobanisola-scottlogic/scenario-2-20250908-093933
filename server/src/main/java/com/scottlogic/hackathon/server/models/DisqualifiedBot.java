package com.scottlogic.hackathon.server.models;

import com.scottlogic.hackathon.game.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class DisqualifiedBot {
    private Id id;
    private String reason;


}
