import { screen } from '@testing-library/react';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import ViewInformation from './ViewInformation';

const mockFunction = () => null;

describe('ViewInformation', () => {
  it('renders the ViewInformation popup correctly', () => {
    renderWithRouterAndProvider(
      <ViewInformation isOpen setIsOpen={mockFunction} />
    );

    expect(
      screen.getByRole('dialog', { name: 'Access information' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Use these details to access your development environment:'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Account ID' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'IAM user name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Password' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
