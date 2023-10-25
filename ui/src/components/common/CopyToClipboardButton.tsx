import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { Button, Snackbar } from '@mui/material';
import { useState } from 'react';

interface CopyToClipboardButtonProps {
  text: string;
}

const CopyToClipboardButton = ({ text }: CopyToClipboardButtonProps) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleClick = () => {
    void navigator.clipboard.writeText(text);
    setIsSnackbarOpen(true);
  };

  return (
    <>
      <Button aria-label='Copy' onClick={handleClick}>
        <ContentCopyRoundedIcon />
      </Button>
      <Snackbar
        open={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        autoHideDuration={3000}
        message='Copied to clipboard'
      />
    </>
  );
};

export default CopyToClipboardButton;
