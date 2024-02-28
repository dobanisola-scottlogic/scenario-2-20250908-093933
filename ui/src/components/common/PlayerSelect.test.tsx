import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { UserRole } from '~/enums/UserRole';
import { validTeamCredentials } from '~/mocks/test-data/hackathon';

import { renderWithRouterAndProvider } from '~/utils/test-utils';
import PlayerSelect from './PlayerSelect';

const mockFunction = () => null;
const hackathonId = 'hackathon1';

const renderComponent = (
  isOptional = false,
  playerNumber = 1,
  isAdminRole = true,
  playerName = ''
) => {
  const preloadedState = {
    auth: isAdminRole
      ? { name: 'admin', role: UserRole.ADMIN, credentials: '' }
      : {
          name: 'team',
          role: UserRole.TEAM,
          credentials: validTeamCredentials.credentials,
        },
  };

  renderWithRouterAndProvider(
    <PlayerSelect
      disableSelect={Boolean(playerName)}
      hackathonId={hackathonId}
      isOptional={isOptional}
      playerName={playerName}
      playerNumber={playerNumber}
      setPlayerName={mockFunction}
    />,
    { preloadedState: preloadedState }
  );
};

describe('PlayerSelect', () => {
  it('should render the PlayerSelect component label correctly when player number is 1', () => {
    renderComponent(false, 1);

    expect(screen.getByTestId('player-1')).toBeInTheDocument();
  });

  it('should render the PlayerSelect component label correctly when player number is 2', () => {
    renderComponent(false, 2);

    expect(screen.getByTestId('player-2')).toBeInTheDocument();
  });

  it('should render the PlayerSelect component label correctly when isOptional is false', () => {
    renderComponent(false, 1);

    expect(screen.getByLabelText('Select player 1 *')).toBeInTheDocument();
  });

  it('should render the PlayerSelect component label correctly when isOptional is true', () => {
    renderComponent(true, 1);

    expect(screen.getByLabelText('Select player 1')).toBeInTheDocument();
  });

  it('should render the PlayerSelect component including with the milestone bots and the teams when the user is an admin', async () => {
    renderComponent(false, 1);

    const dropdownButton = screen.getByRole('button', {
      name: /select player 1/i,
    });

    act(() => {
      fireEvent.mouseDown(dropdownButton);
    });

    await waitFor(() => {
      // Displays the teams:
      expect(screen.getByRole('option', { name: 'Teams' })).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Team 1' })
      ).toBeInTheDocument();

      // Displays the milestones:
      expect(
        screen.getByRole('option', { name: 'Milestones' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Milestone1Bot' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Milestone2Bot' })
      ).toBeInTheDocument();
    });
  });

  it('should render the PlayerSelect component with the first player defaulted to the team when the name is given as a prop', async () => {
    renderComponent(false, 1, false, 'Team 1');

    await waitFor(() => {
      expect(screen.getByTestId('player-1')).toHaveTextContent('Team 1');
    });
  });

  it('should render the PlayerSelect component and not show Teams when the user is logged in as a team role', async () => {
    renderComponent(false, 1, false);

    const dropdownButton = screen.getByRole('button', {
      name: /select player 1/i,
    });

    act(() => {
      fireEvent.mouseDown(dropdownButton);
    });

    await waitFor(() => {
      // Displays the milestones:
      expect(
        screen.getByRole('option', { name: 'Milestones' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Milestone1Bot' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Milestone2Bot' })
      ).toBeInTheDocument();

      // Does not display the teams:
      expect(
        screen.queryByRole('option', { name: /team/i })
      ).not.toBeInTheDocument();
    });
  });
});
