package com.scottlogic.hackathon.server.models;

import com.sleepycat.persist.model.Persistent;

import java.util.Set;

@Persistent
public class Game {
    private Set<GameTeam> teams;
    private Map map;

    public Game() {
    }

    public Game(final Set<GameTeam> teams, final Map map) {
        this.teams = teams;
        this.map = map;
    }

    public Set<GameTeam> getTeams() {
        return teams;
    }

    public Map getMap() {
        return map;
    }
}

