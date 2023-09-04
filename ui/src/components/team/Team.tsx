import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout, selectTeamName } from '../../auth/authSlice';
import { Button } from '@mui/material';

function Team() {
  const name = useAppSelector(selectTeamName);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <h1>You are logged in as team: {name} </h1>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
}

export default Team;
