import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { registerSchema, RegisterSchema } from '../../../validations/registerSchema';
import { z } from 'zod';
import axios from 'axios';

// const bull = (
//   <Box
//     component="span"
//     sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
//   >
//     •
//   </Box>
// );

interface RegisterFormCardProps {
  onRegistrationSuccess: () => void;
}


export default function RegisterFormCard({onRegistrationSuccess}: RegisterFormCardProps ) {
  const [fullName, setFullname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted")
    try {
      const generatedUsername = email.split('@')[0]
      const validatedData: RegisterSchema = registerSchema.parse({ fullName, email, password, userName:generatedUsername })
      console.log("validated data:", validatedData)
      
      const response = await axios.post('http://localhost:3000/api/auth/register', validatedData);
      console.log(response.data)

    // Reset error state on successful registration
    setError('');

    onRegistrationSuccess();
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        console.log("validated error:", err.errors)
      } else {
        console.error('Registration failed:', err);
        setError('Registration failed. Please try again.')
      }
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
          Register
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 2, width: '37ch' } }}
          noValidate
          autoComplete="off"
        >
          <TextField id="outlined-basic" label="Full Name" variant="outlined" onChange={(e) => setFullname(e.target.value)} />
        </Box>
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
          <TextField type="password" id="outlined-basic" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
        </Box>

      </CardContent>
      <CardActions>
        <Button type="submit" variant="contained" color="error" sx={{
          width: '87%',
          bgcolor: 'error',
          border: 'none',
          ml: '25px',
          mb: '25px',
        }}>
          Register
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
