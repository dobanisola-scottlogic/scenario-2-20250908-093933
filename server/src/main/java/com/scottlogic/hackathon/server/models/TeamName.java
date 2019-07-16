package com.scottlogic.hackathon.server.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

@Entity
public class TeamName {
    @NotNull
    @Column(unique = true)
    private String teamName;

    public TeamName() {
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(final String teamName) {
        this.teamName = teamName;
    }
}
