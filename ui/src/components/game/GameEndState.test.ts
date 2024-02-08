import { GameEndState } from '~/components/game/GameEndState';
import { TeamStats } from '~/components/game/TeamStats';
import { CutoffCondition } from '~/enums/CutoffCondition';

describe('GameEndState', () => {
  it('should create non-null instance', () => {
    const teamStats: TeamStats[] = [];
    const cutoffCondition: CutoffCondition = CutoffCondition.CLIENT_QUIT;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState).not.toBeNull();
  });

  it('should populate the gameOverReason property', () => {
    const teamStats: TeamStats[] = [];
    const cutoffCondition: CutoffCondition = CutoffCondition.CLIENT_QUIT;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.gameOverReason).toEqual('Game aborted');
  });

  it('should not populate the winner property when teamStats argument empty', () => {
    const teamStats: TeamStats[] = [];
    const cutoffCondition: CutoffCondition = CutoffCondition.CLIENT_QUIT;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.winner).toBeUndefined();
  });

  it('should populate the winner property when teamStats argument contains elements', () => {
    const teamStats: TeamStats[] = [new TeamStats(0, 'Team1', 0, 0)];
    const cutoffCondition: CutoffCondition = CutoffCondition.CLIENT_QUIT;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.winner).not.toBeUndefined();
  });

  it('should populate the winner property with the correct value version 1', () => {
    const teamStats: TeamStats[] = [
      new TeamStats(0, 'Team1', 0, 0),
      new TeamStats(1, 'Team2', 5, 1),
      new TeamStats(2, 'Team3', 10, 1),
    ];
    const cutoffCondition: CutoffCondition = CutoffCondition.CLIENT_QUIT;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.winner?.teamName).toEqual('Team3');
  });

  it('should populate the winner property with the correct value version 2', () => {
    const teamStats: TeamStats[] = [
      new TeamStats(0, 'Team1', 5, 1),
      new TeamStats(1, 'Team2', 10, 1),
      new TeamStats(2, 'Team3', 0, 0),
    ];
    const cutoffCondition: CutoffCondition = CutoffCondition.CLIENT_QUIT;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.winner?.teamName).toEqual('Team2');
  });

  it('should populate the winner property with the correct value version 3', () => {
    const teamStats: TeamStats[] = [
      new TeamStats(0, 'Team1', 10, 1),
      new TeamStats(1, 'Team2', 0, 0),
      new TeamStats(2, 'Team3', 5, 1),
    ];
    const cutoffCondition: CutoffCondition = CutoffCondition.CLIENT_QUIT;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.winner?.teamName).toEqual('Team1');
  });

  it('should populate the winner property with the correct value when team with most players is disqualified', () => {
    const teamStats: TeamStats[] = [
      new TeamStats(
        0,
        'Team1',
        10,
        1,
        'Attempted to move player not owned by this bot'
      ),
      new TeamStats(1, 'Team2', 0, 0),
      new TeamStats(2, 'Team3', 5, 1),
    ];
    const cutoffCondition: CutoffCondition = CutoffCondition.CLIENT_QUIT;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.winner?.teamName).toEqual('Team3');
  });
});
