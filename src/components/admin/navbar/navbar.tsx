import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from './DUMB MERCH.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../../../context/authContext';

export default function NavbarCustomized() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get loading state and setLoading function from context
  const { setLoading } = useAuth();

  const isActive = (basePath: string) => location.pathname.startsWith(basePath);

  const handleLogout = () => {
    setLoading(true); // Set loading state to true before logging out
    Cookies.remove('authToken'); // Remove the token from cookies

    // Use a timeout to simulate async logout process (adjust if necessary)
    setTimeout(() => {
      setLoading(false); // Reset loading state
      navigate('/'); // Redirect to the login or home page
    }, 1000); // Adjust the delay as needed
  };

  return (
    <Box sx={{ flexGrow: 2 }}>
      <AppBar position="fixed" color='transparent' elevation={0} sx={{ bgcolor: '#181818' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex' }}>
            <img draggable="false" src={Logo} width={50} alt="DUMB MERCH Logo" />
          </Typography>
          <Button component={Link} to="home" color="inherit" sx={{
            color: isActive('/admin/home') ? 'red' : 'white',
            fontWeight: isActive('/admin/home') ? 'bold' : 'normal'
          }}>Home</Button>
          <Button component={Link} to="transaction" color="inherit" sx={{
            color: isActive('/admin/transaction') ? 'red' : 'white',
            fontWeight: isActive('/admin/transaction') ? 'bold' : 'normal'
          }}>Transaction</Button>
          <Button component={Link} to="category" color="inherit" sx={{
            color: isActive('/admin/category') ? 'red' : 'white',
            fontWeight: isActive('/admin/category') ? 'bold' : 'normal'
          }}>Category</Button>
          <Button component={Link} to="products" color="inherit" sx={{
            color: isActive('/admin/products') ? 'red' : 'white',
            fontWeight: isActive('/admin/products') ? 'bold' : 'normal'
          }}>Product</Button>
          <Button component={Link} to="complain" color="inherit" sx={{
            color: isActive('/admin/complain') ? 'red' : 'white',
            fontWeight: isActive('/admin/complain') ? 'bold' : 'normal'
          }}>Complain</Button>
          <Button onClick={handleLogout} color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
