import { Box, Container } from '@mui/material';
import { useState } from 'react';
import AddButton from '~/components/common/AddButton';
import SnackbarAlert from '~/components/common/SnackbarAlert';
import CreateUpdateHackathon from '~/components/popups/CreateUpdateHackathon';
import HackathonListTable from '~/components/tables/HackathonListTable';

const HackathonList = () => {
  const [isCreateHackathonOpen, setIsCreateHackathonOpen] = useState(false);
  const handleIsCreateHackathonOpen = () => setIsCreateHackathonOpen(true);

  return (
    <>
      <SnackbarAlert />

      <Container maxWidth={false} style={{ padding: '40px 50px' }}>
        <Box sx={{ mb: 4 }}>
          <AddButton
            onClick={handleIsCreateHackathonOpen}
            text='Add a new hackathon'
          />
        </Box>
        <HackathonListTable />
        <CreateUpdateHackathon
          isOpen={isCreateHackathonOpen}
          setIsOpen={setIsCreateHackathonOpen}
        />
      </Container>
    </>
  );
};

export default HackathonList;
