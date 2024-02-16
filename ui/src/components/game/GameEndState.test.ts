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

  it('should declare no winner when teamStats argument empty', () => {
    const teamStats: TeamStats[] = [];
    const cutoffCondition: CutoffCondition = CutoffCondition.CLIENT_QUIT;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.result).toEqual('No winner');
  });

  it('should declare correct winner when teamStats argument contains one element', () => {
    const teamStats: TeamStats[] = [new TeamStats(0, 'Team1', 0, 0)];
    const cutoffCondition: CutoffCondition = CutoffCondition.CLIENT_QUIT;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.result).toEqual('Victory for Team1!');
  });

  it('should populate the result property with the correct value version 1', () => {
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

    expect(gameEndState.result).toEqual('Victory for Team3!');
  });

  it('should populate the result property with the correct value version 2', () => {
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

    expect(gameEndState.result).toEqual('Victory for Team2!');
  });

  it('should populate the result property with the correct value version 3', () => {
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

    expect(gameEndState.result).toEqual('Victory for Team1!');
  });

  it('should populate the result property with the correct value when team with most players is disqualified', () => {
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

    expect(gameEndState.result).toEqual('Victory for Team3!');
  });

  it('should populate the winner property with the correct value when turn limit reached and two teams finish on the same number of players remaining', () => {
    const teamStats: TeamStats[] = [
      new TeamStats(0, 'Team1', 0, 0),
      new TeamStats(1, 'Team2', 5, 1),
      new TeamStats(2, 'Team3', 5, 1),
      new TeamStats(3, 'Team4', 9, 1, 'Ugly team'),
    ];
    const cutoffCondition: CutoffCondition = CutoffCondition.TURN_LIMIT_REACHED;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.result).toEqual('Draw between Team2 and Team3');
  });

  it('should populate the winner property with the correct value when turn limit reached and three teams finish on the same number of players remaining and teams created in alphabetical order', () => {
    const teamStats: TeamStats[] = [
      new TeamStats(0, 'Team1', 5, 1),
      new TeamStats(1, 'Team2', 5, 1),
      new TeamStats(2, 'Team3', 5, 1),
      new TeamStats(3, 'Team4', 9, 1, 'Ugly team'),
    ];
    const cutoffCondition: CutoffCondition = CutoffCondition.TURN_LIMIT_REACHED;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.result).toEqual('Draw between Team1, Team2 and Team3');
  });

  it('should populate the winner property with the correct value when turn limit reached and three teams finish on the same number of players remaining and teams created in non-alphabetical order', () => {
    const teamStats: TeamStats[] = [
      new TeamStats(0, 'Team3', 5, 1),
      new TeamStats(1, 'Team1', 5, 1),
      new TeamStats(2, 'Team2', 5, 1),
      new TeamStats(3, 'Team4', 9, 1, 'Ugly team'),
    ];
    const cutoffCondition: CutoffCondition = CutoffCondition.TURN_LIMIT_REACHED;

    const gameEndState: GameEndState = new GameEndState(
      teamStats,
      cutoffCondition
    );

    expect(gameEndState.result).toEqual('Draw between Team1, Team2 and Team3');
  });
});
