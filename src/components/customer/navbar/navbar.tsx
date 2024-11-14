import { Link, useLocation, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from './DUMB MERCH.png';
import Cookies from 'js-cookie';
import { useAuth } from '../../../context/authContext';

export default function NavbarCustomized() {
  const location = useLocation(); // Get the current path
  const navigate = useNavigate();

  const { setLoading } = useAuth();

  // Helper function to apply styles conditionally
  const isActive = (basePath: string) => location.pathname.startsWith(basePath);

  const handleLogout = () => {
    setLoading(true); // Set loading state to true before logging out
    Cookies.remove('authToken'); // Remove the token from cookies
    setTimeout(() => {
      setLoading(false); // Reset loading state
      navigate('/'); // Redirect to the login or home page
    }, 1000); // Adjust the delay as needed
  };

  return (
    <Box sx={{ flexGrow: 2 }}>
      <AppBar position="fixed" color='transparent' elevation={0}
        sx={{
          bgcolor: '#181818',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex' }}>
            <img draggable="false" src={Logo} width={50} alt="DUMB MERCH Logo" />
          </Typography>
          <Button component={Link} to="home" color="inherit"
            sx={{
              color: isActive('/customer/home') ? 'red' : 'white',
              fontWeight: isActive('/customer/home') ? 'bold' : 'normal'
            }}>Home</Button>
          <Button component={Link} to="complain" color="inherit" sx={{
            color: isActive('/customer/complain') ? 'red' : 'white',
            fontWeight: isActive('/customer/complain') ? 'bold' : 'normal'
          }}>Complain</Button>
          <Button component={Link} to="my-cart" color="inherit"
            sx={{
              color: isActive('/customer/my-cart') ? 'red' : 'white',
              fontWeight: isActive('/customer/my-cart') ? 'bold' : 'normal'
            }}>My Cart</Button>
          <Button component={Link} to="profile" color="inherit" sx={{
            color: isActive('/customer/profile') ? 'red' : 'white',
            fontWeight: isActive('/customer/profile') ? 'bold' : 'normal'
          }}>Profile</Button>
          <Button onClick={handleLogout} color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
