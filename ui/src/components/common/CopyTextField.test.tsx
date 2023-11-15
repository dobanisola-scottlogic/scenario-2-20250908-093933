import { screen } from '@testing-library/react';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import CopyTextField from './CopyTextField';

describe('CopyTextField', () => {
  it('renders the CopyTextField component correctly', () => {
    renderWithRouterAndProvider(
      <CopyTextField label='test label' value='test value' />
    );

    expect(
      screen.getByRole('textbox', { name: 'test label' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.getByTestId('copy-text-input')).toHaveValue('test value');
    expect(screen.getByTestId('copy-text-input')).toHaveAttribute('readonly');
  });
});
