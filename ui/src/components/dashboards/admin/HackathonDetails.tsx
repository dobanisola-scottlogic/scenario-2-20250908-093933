import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import AddButton from '../../common/AddButton';
import SnackbarAlert from '../../common/SnackbarAlert';
import AddTeam from '../../popups/AddTeam';
import DeleteTeam from '../../popups/DeleteTeam';

const HackathonDetails = () => {
  const { id } = useParams();
  // TODO: on HAC-75 make API call to get hackathon by id and replace the id with name in header below
  // and move the delete team button as per UX designs

  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);
  const handleDeleteTeamOpen = () => setIsDeleteTeamOpen(true);

  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const handleAddTeamOpen = () => setIsAddTeamOpen(true);

  return (
    <>
      <SnackbarAlert />

      <Container maxWidth={false} style={{ padding: '40px 50px' }}>
        <Box>
          <Typography
            sx={{
              display: 'inline-flex',
            }}
          >
            <Link to={'/'}>Hackathons</Link>
            <KeyboardArrowRight fontSize="small" />
            {id}
          </Typography>
        </Box>
        <AddButton onClick={handleAddTeamOpen} text="Add a new team" />
        <AddTeam isOpen={isAddTeamOpen} id={id} setIsOpen={setIsAddTeamOpen} />
        <Button onClick={handleDeleteTeamOpen}>Delete team</Button>
        <DeleteTeam
          isOpen={isDeleteTeamOpen}
          id="5a610af8-4d9d-49d0-a927-72c43f245df9"
          setIsOpen={setIsDeleteTeamOpen}
        />
      </Container>
    </>
  );
};

export default HackathonDetails;
