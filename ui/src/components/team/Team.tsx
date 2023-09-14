import { Typography } from '@mui/material';
import { selectTeamName } from '../../auth/authSlice';
import { useAppSelector } from '../../hooks';

const Team = () => {
  const name = useAppSelector(selectTeamName);

  return (
    <>
      <Typography component="h1" variant="h6">
        Team: {name}
      </Typography>
    </>
  );
};

export default Team;
