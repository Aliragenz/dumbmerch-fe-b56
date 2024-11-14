import * as React from 'react';
import Box from '@mui/material/Box';
import Logo from "../image/DUMB MERCH.png";
import LogoText from "../image/Group 1.png";
import Button from '@mui/material/Button';

interface LeftSideProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
  activeButton: 'login' | 'register'; // Add active button type
}

const LeftSide: React.FC<LeftSideProps> = ({ onRegisterClick, onLoginClick, activeButton }) => {
  return (
    <Box
      display="flex"
      width="70%"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="center"
      height="89vh"
      bgcolor="dark"
      overflow="hidden" // Control overflow
      padding={10} // Add padding to avoid content touching edges
    >
      <Box>
        <img src={Logo} alt="Dumb Merch Logo" width="200px" />
      </Box>
      <Box>
        <img src={LogoText} alt="Easy, Fast and Reliable" width="500px" />
      </Box>
      <Box textAlign="left" color="gray">
        <p>Go Shopping for merchandise, just go to dumb merch</p>
        <p>shopping, the biggest merchandise in <b>Indonesia</b></p>
      </Box>
      <Box display="flex" flexDirection="row" gap={1}>
        <Button
          variant={activeButton === 'login' ? 'contained' : 'outlined'}
          color={activeButton === 'login' ? 'error' : 'secondary'} // Change color based on active button
          onClick={onLoginClick}
          sx={{
            borderColor: 'transparent', // Make the border color transparent
            '&:hover': {
              borderColor: 'transparent', // Ensure hover state also has transparent border
            },
          }}>
          Login
        </Button>
        <Button
          variant={activeButton === 'register' ? 'contained' : 'outlined'}
          color={activeButton === 'register' ? 'error' : 'secondary'} // Change color based on active button
          onClick={onRegisterClick}
          sx={{
            borderColor: 'transparent', // Make the border color transparent
            '&:hover': {
              borderColor: 'transparent', // Ensure hover state also has transparent border
            },
          }}>
          Register
        </Button>
      </Box>
    </Box>
  );
}

export default LeftSide;
