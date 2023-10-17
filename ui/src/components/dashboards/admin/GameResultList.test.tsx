import { screen } from '@testing-library/react';

import { renderWithRouterAndProvider } from '../../../utils/test-utils';
import GameResultList from './GameResultList';

describe('GameResultList', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(<GameResultList hackathonId='hackathonId' />, {
      preloadedState: {
        snackbar: { isOpen: true, message: 'Game created successfully!' },
      },
    });
  });

  it('should render the GameResultList component correctly', () => {
    expect(
      screen.getByRole('button', { name: 'Add a new game' })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('List of hackathon games')
    ).toBeInTheDocument();
  });

  it('should render the success snackbar correctly', () => {
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Game created successfully!'
    );
  });
});
