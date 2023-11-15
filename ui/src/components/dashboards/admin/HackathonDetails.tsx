import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { CircularProgress, Container, Grid, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import { useGetHackathonQuery } from '~/api/api';
import SnackbarAlert from '~/components/common/SnackbarAlert';
import { colours } from '~/theme';
import GameResultList from './GameResultList';
import TeamList from './TeamList';

const HackathonDetails = () => {
  const { id } = useParams();

  const { data: hackathon, isLoading, isError } = useGetHackathonQuery(id!);

  return (
    <>
      <SnackbarAlert />

      <Container maxWidth={false} style={{ padding: '30px 50px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              sx={{
                display: 'inline-flex',
                fontWeight: 'normal',
              }}
            >
              <Link to={import.meta.env.BASE_URL}>Hackathons</Link>
              <KeyboardArrowRight />
              {isLoading ? (
                <CircularProgress size={15} sx={{ ml: 1, mt: 0.5 }} />
              ) : isError ? (
                <span style={{ color: colours.errorRed }}>
                  Failed to fetch hackathon. Please try again later.
                </span>
              ) : !hackathon ? (
                <span style={{ color: colours.errorRed }}>
                  This hackathon does not exist. Please create a new hackathon.
                </span>
              ) : (
                <span>
                  <strong>{hackathon?.name}</strong> (
                  <strong>Current Milestone: </strong>
                  {`Map: ${hackathon?.currentMilestoneMap} - Bot: ${hackathon?.readableCurrentMilestoneClassName}`}
                  )
                </span>
              )}
            </Typography>
          </Grid>
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
