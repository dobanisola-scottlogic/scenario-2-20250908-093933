import { ParsedGameConstants } from '~/components/game/ParsedGameConstants';
import { SpawnPoint } from '~/components/game/SpawnPoint';
import { TeamState } from '~/components/game/TeamState';
import { Cell } from '~/interfaces/Cell';
import { Collectable } from '~/interfaces/Collectable';
import { GameResult } from '~/interfaces/GameResult';
import { PhaseResult } from '~/interfaces/PhaseResult';
import { Player } from '~/interfaces/Player';

export class ParsedGameState {
  private constructor(
    public readonly collectables: Collectable[],
    public readonly phase: number,
    public readonly players: Player[],
    public readonly spawnPoints: SpawnPoint[],
    public readonly teams: TeamState[]
  ) {}

  private static parseCollectablePositions = (
    index: number,
    gameData: GameResult,
    previousState: ParsedGameState | null
  ): Collectable[] => {
    let collectables: Collectable[] = [];

    // Set current collectables to previous collectables:
    if (index > 0 && previousState) {
      collectables = previousState.collectables.slice(0);
    }

    // Add new collectables:
    gameData.phaseResults[index].addedCollectables.forEach(
      (addedCollectable) => {
        collectables.push(addedCollectable);
      }
    );

    // Remove collected collectables:
    gameData.phaseResults[index].removedCollectables.forEach(
      (removedCollectableId) => {
        const index = collectables.findIndex(
          (c) => c.id === removedCollectableId
        );

        if (index !== -1) {
          collectables.splice(index, 1);
        }
      }
    );

    return collectables;
  };

  private static parsePlayerPositions = (
    phaseIndex: number,
    phaseResult: PhaseResult,
    previousState: ParsedGameState | null,
    teams: TeamState[] = []
  ): Player[] => {
    const players: Player[] = [];

    const previousPlayers = previousState?.players.map((p) => p.id) ?? [];

    phaseResult.playerPositions.forEach((playerPosition) => {
      let teamIndex = -1;

      let owner = phaseResult.addedPlayers.find(
        (p) => p.id === playerPosition.id
      )?.owner;

      if (!owner) {
        owner = previousState?.players.find(
          (p) => p.id === playerPosition.id
        )?.owner;

        if (!owner) {
          throw `No owner found for player with id=${playerPosition.id} required by PlayerPosition from phase number=${phaseIndex}`;
        }
      }

      if (
        phaseIndex === 0 ||
        previousPlayers.indexOf(playerPosition.id) === -1
      ) {
        if (owner != null) {
          teamIndex = teams.find((t) => t.owner === owner)?.teamIndex ?? -1;
        }
      } else if (previousState) {
        // Add owner and teamIndex for players that haven't just spawned:
        const previousIndex = previousState.players
          .map((previousPlayer) => previousPlayer.id)
          .indexOf(playerPosition.id);

        owner = previousState.players[previousIndex].owner;
        teamIndex = previousState.players[previousIndex].teamIndex;
      }

      teams[teamIndex].playerCount++;

      players.push({
        id: playerPosition.id,
        owner: owner,
        cell: new Cell(playerPosition.position.x, playerPosition.position.y),
        teamIndex: teamIndex,
      });
    });

    return players;
  };

  private static parseSpawnPoints = (
    index: number,
    gameData: GameResult,
    previousState: ParsedGameState | null,
    teams: TeamState[] = []
  ): SpawnPoint[] => {
    let spawnPoints: SpawnPoint[] = [];

    // Set the current spawn points to the previous spawn point
    if (index === 0) {
      gameData.spawnPoints.forEach((spawnPoint) => {
        const teamIndex = teams.findIndex((x) => x.owner === spawnPoint.owner);

        spawnPoints.push({
          id: spawnPoint.id,
          owner: spawnPoint.owner,
          position: spawnPoint.position,
          teamIndex: teamIndex,
        });

        teams[teamIndex].spawnCount++;
      });
    } else {
      const destroyedSpawns: number[] = [];

      spawnPoints = previousState?.spawnPoints?.slice(0) ?? [];

      spawnPoints.forEach((spawnPoint) => {
        // Set the team spawn count:
        teams[spawnPoint.teamIndex].spawnCount =
          previousState!.teams[spawnPoint.teamIndex].spawnCount;

        // Decrement the count if the spawnPoint is in the removedSpawns array:
        const isRemoved = gameData.phaseResults[index].removedSpawnPoints.some(
          (id) => id === spawnPoint.id
        );

        if (isRemoved) {
          teams[spawnPoint.teamIndex].spawnCount--;

          destroyedSpawns.push(spawnPoint.id);
        }
      });

      destroyedSpawns.forEach((destroyedSpawn) => {
        const destroyedSpawnIndex = spawnPoints
          .map((spawnPoint) => spawnPoint.id)
          .indexOf(destroyedSpawn);

        spawnPoints.splice(destroyedSpawnIndex, 1);
      });
    }

    return spawnPoints;
  };

  public static parseMany = (
    gameData: GameResult,
    constants: ParsedGameConstants
  ): ParsedGameState[] => {
    if (!gameData) {
      throw 'No gameData';
    }

    if (!constants) {
      throw 'No ParsedGameConstants';
    }

    const states: ParsedGameState[] = [];

    let previousGameState: ParsedGameState | null = null;

    for (let i = 0; i < gameData.phaseResults.length; i++) {
      const phaseResult = gameData.phaseResults[i];

      const teams: TeamState[] = constants.teams.map((team) => {
        const disqualifiedBot = phaseResult.disqualifiedBots.find(
          (x) => x.id === team.botId
        );

        return new TeamState(disqualifiedBot?.reason, team.botId, team.index);
      });

      const players = this.parsePlayerPositions(
        i,
        phaseResult,
        previousGameState,
        teams
      );

      const collectables = this.parseCollectablePositions(
        i,
        gameData,
        previousGameState
      );

      const spawnPositions = this.parseSpawnPoints(
        i,
        gameData,
        previousGameState,
        teams
      );

      const parsedGameState = new ParsedGameState(
        collectables,
        i,
        players,
        spawnPositions,
        teams
      );

      states.push(parsedGameState);

      // And lastly...
      previousGameState = parsedGameState;
    }

    return states;
  };
}
