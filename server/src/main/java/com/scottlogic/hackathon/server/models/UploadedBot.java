package com.scottlogic.hackathon.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.io.ByteStreams;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.UniqueIdGenerator;
import com.scottlogic.hackathon.server.services.RemoteClassLoader;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.UUID;

@Entity
public class UploadedBot {
    @Id
    private long id;
    String teamId;
    @Lob
    private byte[] data;
    private String botClassName;
    private Date timeStamp;
    private boolean active = false;

    public UploadedBot() {

    }

    public UploadedBot(final Team team, final com.scottlogic.hackathon.game.Id id) {
        this.teamId = team.getId().toString();
        this.timeStamp = DateTime.now(DateTimeZone.UTC).toDate();
        this.id = id.getId();
    }

    public UploadedBot(final Team team) {
        this.teamId = team.getId().toString();
        this.timeStamp = DateTime.now(DateTimeZone.UTC).toDate();
        setId(UniqueIdGenerator.INSTANCE.next());
    }

    public com.scottlogic.hackathon.game.Id getId() {
        return new com.scottlogic.hackathon.game.Id(id);
    }

    public void setId(final com.scottlogic.hackathon.game.Id id) {
        this.id = id.getId();
    }

    public UUID getTeamId() {
        return UUID.fromString(teamId);
    }

    public Date getTimeStamp() {
        return timeStamp;
    }

    public String getBotClassName() {
        return botClassName;
    }

    public void setBotClassName(final String botClassName) {
        this.botClassName = botClassName;
    }

    public void setData(final InputStream inputStream) {
        try {
            this.data = ByteStreams.toByteArray(inputStream);
        } catch (final IOException e) {
            e.printStackTrace();
        }
    }

    @JsonIgnore
    public Bot getBot() {
        Bot loadedBot = null;

        final RemoteClassLoader remoteClassLoader = new RemoteClassLoader(data);
        try {
            loadedBot = (Bot) remoteClassLoader.loadClass(botClassName).newInstance();
        } catch (final ClassNotFoundException | InstantiationException | IllegalAccessException e) {
            e.printStackTrace();
        }

        return loadedBot;
    }

    public boolean getActive() {
        return active;
    }

    public void setActive(final boolean active) {
        this.active = active;
    }
}