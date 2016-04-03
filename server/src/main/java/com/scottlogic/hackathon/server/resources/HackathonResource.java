package com.scottlogic.hackathon.server.resources;

import com.codahale.metrics.annotation.Timed;
import com.scottlogic.hackathon.server.models.Hackathon;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/hackathon")
@Produces(MediaType.APPLICATION_JSON)
public class HackathonResource {
    private final String name;

    public HackathonResource(final String name) {
        this.name = name;
    }

    @GET
    @Timed
    public Hackathon getHackathon() {
        return new Hackathon(name);
    }
}
