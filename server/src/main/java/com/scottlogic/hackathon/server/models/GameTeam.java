package com.scottlogic.hackathon.server.models;

import com.sleepycat.persist.model.Persistent;

import java.util.UUID;

@Persistent
public class GameTeam {
    private UUID teamId;
    private String teamName;
    private UUID botId;

    public GameTeam() {
    }

    public GameTeam(final UUID teamId, final String teamName, final UUID botId) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.botId = botId;
    }

    public UUID getTeamId() {
        return teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public UUID getBotId() {
        return botId;
    }
}
