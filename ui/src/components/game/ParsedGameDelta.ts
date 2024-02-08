import { ParsedGameConstants } from '~/components/game/ParsedGameConstants';
import { PlayerTravel } from '~/components/game/PlayerTravel';
import PlayerMovementUtils, { PlayerMovement } from '~/enums/PlayerMovement';
import { Cell } from '~/interfaces/Cell';
import { Collectable } from '~/interfaces/Collectable';
import { GameResult } from '~/interfaces/GameResult';
import { PhaseResult } from '~/interfaces/PhaseResult';
import { Player } from '~/interfaces/Player';
import { PlayerPosition } from '~/interfaces/PlayerPosition';

export class ParsedGameDelta {
  private constructor(
    public readonly collectablesAdded: Collectable[],
    public readonly collectablesCollected: number[],
    public readonly playersAdded: Player[],
    public readonly playersDestroyed: number[],
    public readonly playersTravel: Map<number, PlayerTravel>,
    public readonly spawnPointsDestroyed: number[]
  ) {}

  private static checkBoundary = (value: number): boolean => {
    return value > 1 || value < -1;
  };

  private static parseAddedPlayers = (
    phaseResult: PhaseResult,
    constants: ParsedGameConstants
  ): Player[] => {
    const players: Player[] = [];

    phaseResult.addedPlayers.forEach((player) => {
      const position = phaseResult.playerPositions.find(
        (pos) => pos.id === player.id
      );

      if (!position) {
        throw `No PlayerPosition found for Added Player id=${player.id} in Phase id=${phaseResult.id}, phase=${phaseResult.phase}`;
      }

      const teamIndex = constants.teams.find(
        (t) => t.botId === player.owner
      )?.index;

      if (teamIndex === undefined) {
        throw `No Team found for Added Player id=${player.id}, owner=${player.owner} in Phase id=${phaseResult.id}, phase=${phaseResult.phase}`;
      }

      players.push({
        cell: new Cell(position.position.x, position.position.y),
        id: player.id,
        owner: player.owner,
        teamIndex,
      });
    });

    return players;
  };

  private static parseCollectablesAdded = (
    phaseResult: PhaseResult
  ): Collectable[] => {
    return phaseResult.addedCollectables;
  };

  private static parseCollectablesCollected = (
    phaseResult: PhaseResult
  ): number[] => {
    return phaseResult.removedCollectables;
  };

  private static parseDestroyedPlayers = (
    phaseResult: PhaseResult
  ): number[] => {
    return phaseResult.removedPlayers;
  };

  private static parseDestroyedSpawnPoints = (
    phaseResult: PhaseResult
  ): number[] => {
    return phaseResult.removedSpawnPoints;
  };

  private static parsePlayerMovements = (
    phaseResult: PhaseResult,
    previousPhaseResult: PhaseResult | undefined
  ): Map<number, PlayerTravel> => {
    if (phaseResult.phase !== 0 && !previousPhaseResult) {
      throw `Unable to parse player movement for PhaseResult where phase=${phaseResult.phase}: previousPhaseResult was not specified`;
    }

    const movements = new Map<number, PlayerTravel>();

    phaseResult.playerPositions.forEach((playerPosition: PlayerPosition) => {
      if (phaseResult.phase === 0) {
        // Every player should be treated as a spawn:
        movements.set(
          playerPosition.id,
          new PlayerTravel(
            PlayerMovement.STATIONARY,
            playerPosition.position,
            false
          )
        );
      } else {
        const previousPhasePlayerPosition =
          previousPhaseResult!.playerPositions.find(
            (position) => position.id === playerPosition.id
          );

        let playerMovement: PlayerMovement = PlayerMovement.STATIONARY;
        let hasWrappedAroundMap = false;

        if (previousPhasePlayerPosition) {
          let xMovement =
            playerPosition.position.x - previousPhasePlayerPosition.position.x;

          let yMovement =
            playerPosition.position.y - previousPhasePlayerPosition.position.y;

          hasWrappedAroundMap =
            this.checkBoundary(xMovement) || this.checkBoundary(yMovement);

          // Handle the wrapping of the map:
          xMovement = xMovement > 1 ? -1 : xMovement;
          xMovement = xMovement < -1 ? 1 : xMovement;
          yMovement = yMovement > 1 ? -1 : yMovement;
          yMovement = yMovement < -1 ? 1 : yMovement;

          playerMovement = PlayerMovementUtils.calculatePlayerMovement(
            xMovement,
            yMovement
          );
        }

        movements.set(
          playerPosition.id,
          new PlayerTravel(
            playerMovement,
            playerPosition.position,
            hasWrappedAroundMap
          )
        );
      }
    });

    return movements;
  };

  public static parseMany = (
    gameData: GameResult,
    constants: ParsedGameConstants
  ): ParsedGameDelta[] => {
    if (!gameData) {
      throw 'No gameData';
    }

    if (!constants) {
      throw 'No constants';
    }

    const deltas: ParsedGameDelta[] = [];
    let previousPhaseResult: PhaseResult | undefined;

    for (const phaseResult of gameData.phaseResults) {
      const collectablesAdded = this.parseCollectablesAdded(phaseResult);
      const collectablesCollected =
        this.parseCollectablesCollected(phaseResult);
      const playersAdded = this.parseAddedPlayers(phaseResult, constants);
      const playersDestroyed = this.parseDestroyedPlayers(phaseResult);
      const playersMovements = this.parsePlayerMovements(
        phaseResult,
        previousPhaseResult
      );
      const spawnPointsDestroyed = this.parseDestroyedSpawnPoints(phaseResult);

      const delta = new ParsedGameDelta(
        collectablesAdded,
        collectablesCollected,
        playersAdded,
        playersDestroyed,
        playersMovements,
        spawnPointsDestroyed
      );

      deltas.push(delta);

      previousPhaseResult = phaseResult;
    }

    return deltas;
  };
}
