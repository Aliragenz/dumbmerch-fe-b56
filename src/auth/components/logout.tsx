import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Your logout logic here
    // e.g., clear tokens, call API, etc.

    // Redirect to home or login page
    navigate('/');
  };

  // Call logout function when component mounts
  React.useEffect(() => {
    handleLogout();
  }, []);

  return <div>Logging out...</div>; // Optionally show a loading message
};

export default LogoutComponent;
