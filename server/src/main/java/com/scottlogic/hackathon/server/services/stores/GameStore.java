package com.scottlogic.hackathon.server.services.stores;

import java.util.List;
import com.google.inject.Inject;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.scottlogic.hackathon.server.models.GameResult;
import com.scottlogic.hackathon.server.models.Team;

public class GameStore extends AbstractStore<GameResult> {
  private final Logger logger;

  @Inject
  public GameStore(final SessionFactory sessionFactory) {
    super(sessionFactory);
    logger = LoggerFactory.getLogger(this.getClass().getName());
  }

  public List<GameResult> getGamesForTeam(Team team) {
    var gamesForTeam = currentSession()
        .createSelectionQuery(
            "from GameResult where hackathonId like :hackathonSearchPattern and game like :gameSearchPattern",
            GameResult.class)
        .setParameter("hackathonSearchPattern", team.getHackathonId())
        .setParameter("gameSearchPattern", "%" + team.getName() + "%")
        .getResultList();
    return gamesForTeam;
  }
}
