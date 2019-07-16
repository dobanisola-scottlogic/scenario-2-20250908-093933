package com.scottlogic.hackathon.game.engine.models;

import com.scottlogic.hackathon.game.*;
import lombok.Value;

@Value
public class PhaseResultImpl implements PhaseResult {
    int phase;
    TrackedSet<Player> players;
    TrackedSet<SpawnPoint> spawnPoints;
    TrackedSet<Collectable> collectables;
    TrackedSet<DisqualifiedBot> disqualifiedBots;
}
