import { AppBar, Toolbar, Typography } from '@mui/material';
import { selectUserRole } from '../../auth/authSlice';
import { useAppSelector } from '../../hooks';
import NavbarMenu from './NavbarMenu';

const Navbar = () => {
  const userRole = useAppSelector(selectUserRole);

  return (
    <>
      <AppBar elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="header">
            Hackathon
          </Typography>
          {userRole && <NavbarMenu />}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
