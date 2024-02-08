package com.scottlogic.hackathon.server;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.core.Configuration;
import io.dropwizard.db.DataSourceFactory;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import com.scottlogic.hackathon.bots.*;
import com.scottlogic.hackathon.server.models.MilestoneBot;

public class HackathonConfiguration extends Configuration {
  @Valid @NotNull private DataSourceFactory database = new DataSourceFactory();

  @NotEmpty private String name = "Code Challenge";

  @JsonProperty("database")
  public void setDataSourceFactory(final DataSourceFactory factory) {
    this.database = factory;
  }

  @JsonProperty("database")
  public DataSourceFactory getDataSourceFactory() {
    return database;
  }

  @JsonProperty
  public String getName() {
    return name;
  }

  @JsonProperty
  public void setName(final String name) {
    this.name = name;
  }

  public List<MilestoneBot> getMilestoneBots() {
    List<MilestoneBot> milestoneBots = new ArrayList<>();
    milestoneBots.add(new MilestoneBot(new Milestone1Bot()));
    milestoneBots.add(new MilestoneBot(new Milestone2Bot()));
    milestoneBots.add(new MilestoneBot(new Milestone3Bot()));
    milestoneBots.add(new MilestoneBot(new Milestone4Bot()));
    milestoneBots.add(new MilestoneBot(new Milestone5Bot()));
    milestoneBots.add(new MilestoneBot(new FastExpansionBot()));
    return milestoneBots;
  }
}
