import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { PopupProps } from '../../interfaces/PopupProps';
import CopyTextField from '../common/CopyTextField';

const ViewInformation = ({ isOpen, setIsOpen }: PopupProps) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dialog
        aria-labelledby='access-information'
        onClose={handleClose}
        open={isOpen}
      >
        <DialogContent sx={{ width: 500 }}>
          <Typography id='access-information' sx={{ my: 1 }}>
            Access information
          </Typography>
          <Typography sx={{ fontWeight: 'normal', my: 2 }}>
            Use these details to access your development environment:
          </Typography>
          <CopyTextField label='Account ID' value='032044580362' />
          <CopyTextField label='IAM user name' value='hackathon-contestant' />
          <CopyTextField label='Password' value='Password!1' />
          <Typography sx={{ fontWeight: 'normal', mt: 2 }}>
            <Link
              to={'#'}
              aria-label='This link is a placeholder and does not navigate to a functional page'
            >
              Access your development environment
            </Link>
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              m: 1,
            }}
          >
            <Button onClick={handleClose}>Close</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewInformation;
