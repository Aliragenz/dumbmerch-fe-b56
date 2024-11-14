import React, { useState } from 'react';
import Box from '@mui/material/Box';
import LeftSide from './login/left-side';
import LoginFormCard from './login/login-form';
import RegisterFormCard from './register/register-form';

const Login: React.FC = () => {
  const [activeButton, setActiveButton] = useState<'login' | 'register'>('login'); // Default to login

  const onLoginClick = () => {
    setActiveButton('login'); // Set active button to login
  };

  const onRegisterClick = () => {
    setActiveButton('register'); // Set active button to register
  };

  const handleRegistrationSuccess = () => {
    setActiveButton('login')
  }

  return (
    <Box display="flex" flexDirection="row">
      <LeftSide 
        onRegisterClick={onRegisterClick} 
        onLoginClick={onLoginClick}
        activeButton={activeButton} // Pass the active button state
      />
      {activeButton === 'login' ? <LoginFormCard /> : <RegisterFormCard onRegistrationSuccess={handleRegistrationSuccess} />}
    </Box>
  );
};

export default Login;
