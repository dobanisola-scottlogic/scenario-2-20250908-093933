import { TeamStats } from '~/components/game/TeamStats';
import CutoffConditionUtils, { CutoffCondition } from '~/enums/CutoffCondition';

export class GameEndState {
  public readonly gameOverReason: string;
  public readonly winner: TeamStats | undefined;

  constructor(
    public readonly teamStats: TeamStats[],
    public readonly cutoffCondition: CutoffCondition
  ) {
    this.gameOverReason = CutoffConditionUtils.toString(this.cutoffCondition);

    this.winner = this.teamStats
      ?.filter((x) => !x.disqualificationReason)
      .sort((a, b) => b.playersRemainingCount - a.playersRemainingCount)
      .shift();
  }
}
