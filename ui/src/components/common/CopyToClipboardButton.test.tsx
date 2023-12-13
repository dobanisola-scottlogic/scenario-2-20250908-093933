import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import CopyToClipboardButton from './CopyToClipboardButton';

const writeText = vi.fn();

// HAC-271 : Causes failure on build pipeline
/* Object.assign(navigator, {
  clipboard: {
    writeText,
  },
}); */

describe('CopyToClipboardButton', () => {
  it.skip('copies the text value to clipboard and opens a confirmation snackbar', async () => {
    renderWithRouterAndProvider(<CopyToClipboardButton text='test' />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith('test');

    const snackbar = await screen.findByRole('alert');

    expect(snackbar).toHaveTextContent('Copied to clipboard');
  });
});
