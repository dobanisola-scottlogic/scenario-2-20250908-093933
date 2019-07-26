package com.scottlogic.hackathon.server.services;


import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.scottlogic.hackathon.game.Bot;
import com.scottlogic.hackathon.game.UniqueIdGenerator;
import com.scottlogic.hackathon.remote.RemoteBotConnector;
import com.scottlogic.hackathon.remote.notify.RemoteBotChangeEvent;
import com.scottlogic.hackathon.server.authentication.User;
import com.scottlogic.hackathon.server.models.*;
import com.scottlogic.hackathon.server.services.stores.ActiveBot;
import com.scottlogic.hackathon.server.services.stores.BotStore;
import io.dropwizard.hibernate.UnitOfWork;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.stream.Collectors.*;

@Singleton
public class BotService {
    private final Logger logger;
    private final BotStore botStore;
    private final TeamService teamService;
    private final GameService gameService;
    private final MilestoneService milestoneService;
    private final HackathonService hackathonService;
    private final RemoteBotStore remoteBotStore;


    @Inject
    public BotService(final BotStore botStore,
                      final TeamService teamService,
                      final GameService gameService,
                      final MilestoneService milestoneService,
                      final HackathonService hackathonService,
                      final RemoteBotStore remoteBotStore) {
        this.botStore = botStore;
        this.teamService = teamService;
        this.gameService = gameService;
        this.milestoneService = milestoneService;
        this.hackathonService = hackathonService;
        this.remoteBotStore = remoteBotStore;

        botStore.configureIdGenerator();
        logger = LoggerFactory.getLogger(this.getClass().getName());
    }

    public void addRemoteTeamBot(final Team team) {
        logger.debug("Adding remote team bot:{}", team.getName());
        RemoteBotConnector remoteBotConnector = new RemoteBotConnector();
        remoteBotConnector.waitForConnect(team.getName());
        remoteBotStore.save(team, remoteBotConnector);
        logger.debug("Team: {} -> connection status {}", remoteBotConnector.getTeam(), remoteBotConnector.getState());
    }

    public GameResult playMilestone(final User user, final Team team, final String milestone, final String map) {
        logger.debug("Team:{} playing milestone game.", team.getName());
        if (getRemoteTeamBotConnectionState(team) == RemoteBotConnector.State.CONNECTED) {
            Hackathon hackathon = hackathonService.getHackathon(team.getHackathonId());

            GameConfiguration gameConfiguration = new GameConfiguration(
                    new HashSet<>(Arrays.asList(team.getName(), MilestoneBot.MILESTONE_BOT_PREFIX + milestone)),
                    map,
                    hackathon.getId()
            );
            removeOldMilestoneGames(team);
            return gameService.playGameDebug(user, gameConfiguration, createTeamBotMap(user, gameConfiguration));
        } else {
            logger.error("Team:{} cannot play default game as not currently connected!.", team.getName());
        }
        return null;
    }



    public RemoteBotConnector.State getRemoteTeamBotConnectionState(final Team team) {
        return remoteBotStore.getConnectionState(team.getName());

    }

    public UploadedBot addTeamBot(final User user, final Team team, final String botClassName, final InputStream inputStream) {
        UploadedBot uploadedBot = this.addBot(team, botClassName, inputStream);
        UploadedBot result = null;

        if (uploadedBot != null) {
            if (botStore.setActiveBot(uploadedBot) != null) {
                result = uploadedBot;
            }

            Hackathon hackathon = hackathonService.getHackathon(team.getHackathonId());

            GameConfiguration gameConfiguration = new GameConfiguration(
                    new HashSet<>(Arrays.asList(team.getName(), hackathon.getCurrentMilestoneClassName())),
                    hackathon.getCurrentMilestoneMap(),
                    hackathon.getId()
            );

            gameService.playGame(user, gameConfiguration, createTeamBotMap(user, gameConfiguration));
        }

        return result;
    }

    public UploadedBot addBot(final Team team, final String botClassName, final InputStream inputStream) {
        UploadedBot result = null;

        final UploadedBot uploadedBot = new UploadedBot(team);
        uploadedBot.setBotClassName(botClassName);
        uploadedBot.setData(inputStream);

        final Bot validBot = uploadedBot.getBot();
        if (validBot != null) {
            result = botStore.saveOrUpdate(uploadedBot);
        }

        return result;
    }


    private UploadedBot getBot(final UUID id) {
        return botStore.get(id);
    }

    public List<UploadedBot> getUploadedBots(final User user) {
        final List<UploadedBot> allVisibleBots;
        if (user.isAdmin()) {
            allVisibleBots = botStore.list();
        } else {
            allVisibleBots = this.getUploadedBots(user.getName());
        }
        return allVisibleBots;
    }

    public List<UploadedBot> getUploadedBots(final String userName) {
        final Team team = teamService.getTeam(userName);
        return botStore.list(Restrictions.eq("teamId", team.getId().toString()));
    }


    public boolean deleteUploadedBot(final User user, final UUID id) {
        boolean result = false;

        if (userCanAccessBot(user, id)) {
            result = botStore.delete(id);
        }

        return result;
    }

    private boolean userCanAccessBot(final User user, final UUID id) {
        boolean result = false;

        if (user.isAdmin()) {
            result = true;
        } else if (user.isTeam()) {
            final Team team = teamService.getTeam(user.getName());
            final UploadedBot uploadedBot = botStore.get(id);

            if (uploadedBot != null && team.getId().equals(uploadedBot.getTeamId())) {
                result = true;
            }
        }

        return result;
    }

    public List<UploadedBot> getActiveBots(final User user) {
        Stream<UploadedBot> activeBots = botStore.list(Restrictions.eq("active", true)).stream();

        if (user.isTeam()) {
            final UUID teamId = teamService.getTeam(user.getName()).getId();
            activeBots = activeBots
                    .filter(activeBot -> activeBot.getTeamId().equals(teamId));
        }

        final List<UploadedBot> bots = activeBots
                .collect(toList());

        return Collections.unmodifiableList(bots);
    }


    public UploadedBot setActiveBot(final User user, final ActiveBot activeBot) {
        UploadedBot result = null;
        Team team = null;

        if (user.isAdmin()) {
            team = teamService.getTeam(activeBot.getTeamId());
        } else {
            final Team usersTeam = teamService.getTeam(user.getName());
            if (usersTeam.getId().equals(activeBot.getTeamId()) || activeBot.getTeamId() == null) {
                team = usersTeam;
            } else {
                logger.error("Requested team id is not your team id");
            }
        }

        if (team != null) {
            final UploadedBot uploadedBot = getBot(activeBot.getBotId());
            if (uploadedBot != null) {
                if (botStore.setActiveBot(uploadedBot) != null) {
                    result = uploadedBot;
                }
            }
        }

        return result;
    }

    public Map<Team, Bot> createTeamBotMap(final User user, final GameConfiguration gameConfiguration) {
        final java.util.Map<UUID, UploadedBot> activeUploadedBots = this
                .getActiveBots(user)
                .stream()
                .collect(toMap(uploadedBot -> uploadedBot.getTeamId(), Function.identity()));

        final Map<String, MilestoneBot> milestoneBots = milestoneService
                .getMilestones()
                .stream()
                .collect(toMap(milestoneBot -> milestoneBot.getMilestoneClassName(), Function.identity()));

        final Map<String, Team> teams = gameConfiguration
                .getTeams()
                .stream()
                .collect(toMap(Function.identity(), teamName -> {
                    if (teamName.startsWith(MilestoneBot.MILESTONE_BOT_PREFIX)) {
                        Team adminTeam = new Team();
                        adminTeam.setName(teamName);
                        return adminTeam;
                    } else {
                        return teamService.getTeam(teamName);
                    }
                }));

        final Map<Team, Bot> teamBots = teams.values()
                .stream()
                .filter(team -> team != null)
                .collect(toMap(Function.identity(), team -> {
                    if (team.getName().startsWith(MilestoneBot.MILESTONE_BOT_PREFIX)) {
                        final MilestoneBot milestoneBot = milestoneBots.get(team.getName());
                        return milestoneBot.getBot();
                    } else {
                        final UploadedBot uploadedBot = activeUploadedBots.get(team.getId());

                        return remoteBotStore.get(uploadedBot.getId())
                                .map(b -> (Bot) b)
                                .orElseGet(uploadedBot::getBot);

                    }
                }));


        return teamBots;
    }

    private void removeOldMilestoneGames(Team team) {
        Set<String> milestoneClasses = milestoneService.getMilestones().stream()
                .map(MilestoneBot::getMilestoneClassName).collect(toSet());
        gameService.deleteMileStoneGameResults(team, milestoneClasses);
    }

}
