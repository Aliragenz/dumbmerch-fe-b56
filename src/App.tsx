import { useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouter } from './routes';
import './App.css';
import { Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Custom MUI theme
const muiTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#181818",
      paper: "#1f1f1f",
    },
  },
});

function App() {
  return (
        <ThemeProvider theme={muiTheme}>
          <AuthProvider>
          <CssBaseline />
          <Provider store={store}>
            <AppRouter />
          </Provider>
          </AuthProvider>
        </ThemeProvider>
  );
}

export default App;
