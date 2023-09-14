import { screen } from '@testing-library/react';
import { UserRole } from '../../enums/UserRole';
import { renderWithProviders } from '../../utils/test-utils';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('should render the Navbar component correctly when the user is not logged in', () => {
    renderWithProviders(<Navbar />);

    expect(screen.getAllByRole('banner')[1]).toHaveTextContent('Hackathon');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render the Navbar component correctly when the user is logged in', () => {
    renderWithProviders(<Navbar />, {
      preloadedState: {
        auth: { name: 'admin', role: UserRole.ADMIN, credentials: '' },
      },
    });

    expect(screen.getAllByRole('banner')[1]).toHaveTextContent('Hackathon');
    expect(screen.getByRole('button', { name: 'admin' })).toBeInTheDocument();
  });
});
