import { screen } from '@testing-library/react';

import { renderWithRouterAndProvider } from '~/utils/test-utils';
import GameResultList from './GameResultList';

describe('GameResultList', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(<GameResultList hackathonId='hackathonId' />);
  });

  it('should render the GameResultList component correctly', () => {
    expect(
      screen.getByRole('button', { name: 'Add a new game' })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('List of hackathon games')
    ).toBeInTheDocument();
  });
});
