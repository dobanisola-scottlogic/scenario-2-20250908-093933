import { SpawnPoint } from '~/components/game/SpawnPoint';
import { Team } from '~/components/game/Team';
import { CutoffCondition } from '~/enums/CutoffCondition';
import { GameResult } from '~/interfaces/GameResult';
import { Position } from '~/interfaces/Position';

export class ParsedGameConstants {
  private constructor(
    public readonly cutoffCondition: CutoffCondition,
    public readonly height: number,
    public readonly id: string,
    public readonly outOfBoundPositions: Position[],
    public readonly spawnPoints: SpawnPoint[],
    public readonly teams: Team[],
    public readonly width: number
  ) {}

  public static parse = (gameResult: GameResult): ParsedGameConstants => {
    if (!gameResult) {
      throw 'No gameResult';
    }

    const teams: Team[] = gameResult.game.teams.map(
      (team, index) => new Team(team.botId, index, team.teamName, team.teamId)
    );

    const spawnPoints = gameResult.spawnPoints.map((spawnPoint) => {
      const teamIndex = teams.find((t) => t.botId === spawnPoint.owner)?.index;

      return new SpawnPoint(
        spawnPoint.id,
        spawnPoint.owner,
        spawnPoint.position,
        teamIndex ?? -1
      );
    });

    return new ParsedGameConstants(
      gameResult.cutoffCondition,
      gameResult.game.map.height,
      gameResult.id,
      gameResult.game.map.outOfBoundPositions,
      spawnPoints,
      teams,
      gameResult.game.map.width
    );
  };
}
