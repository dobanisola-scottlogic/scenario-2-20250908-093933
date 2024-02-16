import { screen } from '@testing-library/react';
import { GameEndState } from '~/components/game/GameEndState';
import GameOverPanel from '~/components/game/GameOverPanel';
import { TeamStats } from '~/components/game/TeamStats';
import { CutoffCondition } from '~/enums/CutoffCondition';
import { renderWithRouterAndProvider } from '~/utils/test-utils';

describe('GameOverPanel', () => {
  const width = 1280;

  it('should render the Game Over Panel with Game Over when GameEndState specified with winner', () => {
    const gameEndState: GameEndState = new GameEndState(
      [new TeamStats(0, 'Team1', 1, 1), new TeamStats(1, 'Team2', 0, 0)],
      CutoffCondition.LONE_SURVIVOR
    );

    renderWithRouterAndProvider(
      <GameOverPanel width={width} gameEndState={gameEndState} />
    );

    expect(screen.getByText('Victory for Team1!')).toBeInTheDocument();

    expect(screen.getByText('Players remaining 1')).toBeInTheDocument();

    expect(screen.getByText('Players remaining 0')).toBeInTheDocument();
  });

  it('should render the Game Over Panel with Game Over when GameEndState specified with no winner', () => {
    const gameEndState: GameEndState = new GameEndState(
      [
        new TeamStats(
          0,
          'Team1',
          1,
          1,
          'Attempted to move player not owned by this bot'
        ),
        new TeamStats(
          1,
          'Team2',
          1,
          1,
          'Attempted to move player not owned by this bot'
        ),
      ],
      CutoffCondition.LONE_SURVIVOR
    );

    renderWithRouterAndProvider(
      <GameOverPanel width={width} gameEndState={gameEndState} />
    );

    expect(screen.getByText('No winner')).toBeInTheDocument();
  });
});
