import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import { loginSchema, LoginSchema } from '../../../validations/loginSchema';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import { getUserRole } from '../../../utils/getRole';

export default function LoginFormCard() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const [userRole, setUserRole] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const validatedData: LoginSchema = loginSchema.parse({ email, password });
      const response = await axios.post('http://localhost:3000/api/auth/login', validatedData);
      const token = response.data.token;

      if (token) {
        Cookies.set('authToken', token, { expires: 1 })
        const userRole = getUserRole();
        setUserRole(userRole);

        if (userRole === 'ADMIN') {
          navigate('/admin/home'); // Navigate to the admin home page
          window.location.reload()
        } else if (userRole === 'CUSTOMER') {
          navigate('/customer/home'); // Navigate to the customer home page
          window.location.reload()
        } else {
          navigate('/'); // Navigate to the default page
          window.location.reload()
        }
      } else {
        setError('Login failed. No token received.')
      }

      setError('');

    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        console.error('Login failed:', err);
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false);
    }

  }

  const card = (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Typography gutterBottom sx={{
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'left',
            mt: 2,
            ml: 2,
            fontFamily: "Roboto"

          }}>
            Login
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box
            component="form"
            sx={{ '& > :not(style)': { m: 2, width: '37ch' } }}
            noValidate
            autoComplete="off"
          >
            <TextField id="outlined-basic" label="Email" variant="outlined" onChange={(e) => setEmail(e.target.value)} />
          </Box>
          <Box
            component="form"
            sx={{ '& > :not(style)': { m: 2, width: '37ch' } }}
            noValidate
            autoComplete="off"

          >
            <TextField type="password" id="outlined-basic" label="Password" variant="outlined" color='secondary' onChange={(e) => setPassword(e.target.value)} />
          </Box>

        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained" color="error" sx={{
            width: '87%',
            bgcolor: 'error',
            // border: 'none',
            ml: '25px',
            mb: '25px',
          }}>
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </CardActions>
      </form>
    </React.Fragment>
  );

  return (
    <Box
      width="30%"
      height="89vh"
      bgcolor="dark"
      display="flex"
      justifyContent="center" // Center the Card horizontally
      alignItems="center"     // Center the Card vertically
      flexDirection="column"   // Allow vertical stacking
    >
      <Box mb={2} mr={20}> {/* Add gap above the card */}
        <Card variant="outlined"
          sx={{
            width: 'auto',
            height: 'auto',
            bgcolor: '#292929',
            border: 'none'
          }}>
          {card}
        </Card>
      </Box>
    </Box>
  );
}

