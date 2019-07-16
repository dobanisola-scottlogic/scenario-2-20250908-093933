package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonView;
import com.scottlogic.hackathon.game.Id;
import lombok.Getter;
import lombok.Value;

import java.util.UUID;


public class GameTeam {

    private UUID id;
    @JsonView(Views.List.class)
    @Getter
    private UUID teamId;
    @JsonView(Views.List.class)
    @Getter
    private String teamName;
    @JsonView(Views.Details.class)
    @Getter
    private Id botId;

    public GameTeam() {
    }

    public GameTeam(final UUID id) {
        this.id = id;
    }

    public GameTeam(final UUID teamId, final String teamName, final Id botId) {
        this(UUID.randomUUID());
        this.teamId = teamId;
        this.teamName = teamName;
        this.botId = botId;
    }


}
