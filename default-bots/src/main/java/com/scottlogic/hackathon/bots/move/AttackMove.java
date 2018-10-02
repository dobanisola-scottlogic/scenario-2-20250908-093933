package com.scottlogic.hackathon.bots.move;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Map;
import com.scottlogic.hackathon.game.Player;
import com.scottlogic.hackathon.game.Position;

import java.util.stream.Stream;

public class AttackMove extends MoveBase {

    public AttackMove(final Map map, final Player fullPlayer) {
        super(map, fullPlayer);
    }

    public AttackMove(Direction direction, int distance, Map map, final Player fullPlayer) {
        super(direction, distance, map, fullPlayer);
    }

    @Override
    public void phase() {
        if (opponentPlayerPositions.size() > 0) {
            Position nearestOpponentPosition = null;
            int minDistanceSquared = ACTIVE_RADIUS_SQUARED;
            for (Position opponentPosition : opponentPlayerPositions) {
                if (util.findDistanceBetweenTwoPositionsSquared(playerPosition, opponentPosition) <= minDistanceSquared) {
                    nearestOpponentPosition = opponentPosition;
                    minDistanceSquared = util.findDistanceBetweenTwoPositionsSquared(playerPosition, opponentPosition);
                }
            }
            if (nearestOpponentPosition != null) {
                distance = 0;
                direction = util.preferredThenRandom(getMap().directionsTowards(playerPosition, nearestOpponentPosition))
                        .filter(d -> !util.playersCollideInThisMove(2, d, playerPosition, playersPositions))
                        .findFirst()
                        .orElseGet(util::randomDirection);
            } else {
                setRandomDirectionAndDistance(MINIMUM_RANDOM_DISTANCE, MAXIMUM_RANDOM_DISTANCE);
            }
        } else {
            setRandomDirectionAndDistance(MINIMUM_RANDOM_DISTANCE, MAXIMUM_RANDOM_DISTANCE);
        }
    }

    @Override
    public String getName() {
        return "Attack";
    }

}

