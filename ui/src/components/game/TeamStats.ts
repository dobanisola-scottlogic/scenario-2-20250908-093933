import { getTeamColour } from '~/utils/game-utils';

export class TeamStats {
  teamColour: string;

  constructor(
    public readonly teamIndex: number,
    public readonly teamName: string,
    public readonly playersRemainingCount: number,
    public readonly spawnPointsRemainingCount: number,
    public readonly disqualificationReason?: string
  ) {
    this.teamColour = getTeamColour(teamIndex);
  }
}
