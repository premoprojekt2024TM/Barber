import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Divider } from '@mui/material';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Cookies from 'js-cookie';
import AppTheme from '../../shared-theme/AppTheme';

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  animation: `${fadeInUp} 0.6s ease-out forwards`,  
}));

export default function SignInCard() {
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    try {
      const response = await axiosInstance.post('/api/v1/login', { email, password });

      if (response.status === 200) {
        console.log('Login successful:', response.data);

        const token = response.data.token;
        Cookies.set('auth_token', token, { expires: 7 });

        navigate('/dashboard');
      } else {
        console.error('Login failed:', response.data);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <AppTheme>
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormLabel htmlFor="password">Password</FormLabel>
            </Box>
            <TextField
              name="password"
              placeholder="••••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button type="submit" fullWidth variant="contained">
            Sign in
          </Button>
          <Divider><Typography sx={{ color: 'text.secondary' }}>or</Typography></Divider>
          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" variant="body2" sx={{ alignSelf: 'center' }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Card>
    </AppTheme>
  );
}
