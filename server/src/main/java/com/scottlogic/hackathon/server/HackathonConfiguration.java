package com.scottlogic.hackathon.server;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;
import org.hibernate.validator.constraints.NotEmpty;

public class HackathonConfiguration extends Configuration {
    @NotEmpty
    private String name = "Code Challenge";

    @JsonProperty
    public String getName() {
        return name;
    }

    @JsonProperty
    public void setName(final String name) {
        this.name = name;
    }
}
