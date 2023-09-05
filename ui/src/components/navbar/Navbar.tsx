import {
  AppBar,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import theme from '../../theme';

function Navbar() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar elevation={0} sx={{ backgroundColor: '#EFEFEF' }}>
          <Toolbar>
            <Typography
              variant="h6"
              component="header"
              sx={{
                flexGrow: 1,
                textAlign: 'left',
                color: '#000000DE',
                fontWeight: 'bold',
              }}
            >
              Hackathon
            </Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  );
}

export default Navbar;
