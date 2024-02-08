import { getTeamColour } from '~/utils/game-utils';

export class Team {
  public readonly colour: string;

  constructor(
    public readonly botId: number,
    public readonly index: number,
    public readonly teamName: string,
    public readonly teamId: string | null = null
  ) {
    this.colour = getTeamColour(this.index);
  }
}
