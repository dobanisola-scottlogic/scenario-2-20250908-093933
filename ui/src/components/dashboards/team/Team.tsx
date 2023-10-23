import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { useGetHackathonForTeamUserQuery } from '../../../api/api';
import { colours } from '../../../theme';
import AddButton from '../../common/AddButton';

const Team = () => {
  const {
    data: hackathon,
    isLoading,
    isError,
  } = useGetHackathonForTeamUserQuery();

  // TODO implement actions/popups on HAC-83, HAC-84, HAC-85
  const handleClick = () => alert('Not yet functional');

  return (
    <>
      <Container maxWidth={false} style={{ padding: '30px 50px' }}>
        <Stack spacing={3}>
          <Typography sx={{ fontWeight: 'normal' }}>
            <strong>Current Milestone: </strong>
            {isLoading && <CircularProgress size={15} sx={{ ml: 1 }} />}
            {isError && (
              <span style={{ color: colours.errorRed }}>
                Failed to fetch current milestone.
              </span>
            )}
            {!isLoading &&
              !isError &&
              `Map: ${hackathon?.currentMilestoneMap} - Bot: ${hackathon?.readableCurrentMilestoneClassName}`}
          </Typography>
          <Typography sx={{ fontWeight: 'normal' }}>
            To view the information needed to access your development
            environment, click here:
            <Button
              variant='outlined'
              onClick={handleClick}
              startIcon={<VisibilityOutlinedIcon />}
              sx={{ ml: 2 }}
            >
              View information
            </Button>
          </Typography>
          <Typography sx={{ fontWeight: 'normal' }}>
            To connect your bot, click on the connect button and then start your
            bot:
            <Button
              variant='outlined'
              onClick={handleClick}
              startIcon={<LinkOutlinedIcon />}
              sx={{ ml: 2 }}
            >
              Connect
            </Button>
            <Typography component='span' sx={{ fontWeight: 'normal', ml: 2 }}>
              Status: Disconnected
            </Typography>
          </Typography>
        </Stack>
        <Box sx={{ mb: 3, mt: 4 }}>
          <AddButton
            disabled={true}
            onClick={() => {
              alert('Feature not yet implemented');
            }}
            text='Add a new game'
          />
        </Box>
        <Box
          sx={{
            background: 'white',
            height: '60vh',
            borderRadius: '9px',
          }}
        >
          Placeholder for games table
        </Box>
      </Container>
    </>
  );
};

export default Team;
