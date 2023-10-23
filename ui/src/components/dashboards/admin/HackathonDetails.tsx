import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Box, Container, Grid, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import GameResultList from './GameResultList';
import TeamList from './TeamList';

const HackathonDetails = () => {
  const { id } = useParams();
  // TODO: on HAC-75 make API call to get hackathon by id and replace the id with name in header below

  return (
    <>
      <Container maxWidth={false} style={{ padding: '30px 50px' }}>
        <Box>
          <Typography
            sx={{
              display: 'inline-flex',
            }}
          >
            <Link to={import.meta.env.BASE_URL}>Hackathons</Link>
            <KeyboardArrowRight fontSize='small' />
            {id}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TeamList hackathonId={id!} />
          </Grid>
          <Grid item xs={9}>
            <GameResultList hackathonId={id!} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HackathonDetails;
