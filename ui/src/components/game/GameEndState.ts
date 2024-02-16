import { TeamStats } from '~/components/game/TeamStats';
import CutoffConditionUtils, { CutoffCondition } from '~/enums/CutoffCondition';

export class GameEndState {
  public readonly gameOverReason: string;
  public readonly result: string | undefined;

  constructor(
    public readonly teamStats: TeamStats[],
    public readonly cutoffCondition: CutoffCondition
  ) {
    this.gameOverReason = CutoffConditionUtils.toString(this.cutoffCondition);

    const teamsNotDisqualified = this.teamStats?.filter(
      (x) => !x.disqualificationReason
    );

    let maxPlayersRemainingCount = 0;

    for (const teamStat of teamsNotDisqualified) {
      if (teamStat.playersRemainingCount > maxPlayersRemainingCount) {
        maxPlayersRemainingCount = teamStat.playersRemainingCount;
      }
    }

    const winners = teamsNotDisqualified
      .filter((x) => x.playersRemainingCount == maxPlayersRemainingCount)
      .map((x) => x.teamName)
      .sort();

    if (winners.length < 1) {
      this.result = 'No winner';
    } else if (winners.length < 2) {
      this.result = `Victory for ${winners[0]}!`;
    } else {
      const formattedWinners =
        winners.slice(0, -1).join(', ') + ' and ' + winners[winners.length - 1];

      this.result = `Draw between ${formattedWinners}`;
    }
  }
}
