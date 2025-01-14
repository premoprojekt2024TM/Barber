import React, { useState, useEffect } from 'react';
import { Box, Button, Checkbox, CssBaseline, Divider, FormControlLabel, FormLabel, FormControl, Link, TextField, Typography, Stack, Card as MuiCard, styled,   } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; 
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { loginSchema } from '../../../server/src/shared/validation/userValidation'; 
import axiosInstance from '../axios/axiosInstance';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '100%', padding: theme.spacing(4), gap: theme.spacing(2),
  margin: 'auto', opacity: 0, transform: 'translateY(30px)', animation: `${fadeInUp} 0.6s ease-out forwards`,
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)', minHeight: '100%', padding: theme.spacing(2),
  display: 'flex', justifyContent: 'center', alignItems: 'center', animation: `${fadeInUp} 0.6s ease-out`,
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
}));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    if (authToken) {
      try {
        const { role }: { role: string } = jwtDecode(authToken);  
        navigate(role === 'client' ? '/auth/client' : '/auth/hair');  
      } catch {
        Cookies.remove('auth_token');
      }
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = { email: data.get('email') as string, password: data.get('password') as string };
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const validationErrors = result.error.errors.reduce((acc, { path, message }) => ({ ...acc, [path[0]]: message }), {});
      setErrors(validationErrors);
    } else {
      try {
        setIsSubmitting(true);
        const { data: { token }, status } = await axiosInstance.post('/api/login', formData);
        if (status === 200) {
          Cookies.set('auth_token', token, { expires: 1 });  
          const { role }: { role: string } = jwtDecode(token);  
          navigate(role === 'client' ? '/auth/client' : '/auth/hair');
        }
      } catch {
        setErrors({ api: 'Login failed, please check your credentials.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email" name="email" type="email" placeholder="your@email.com" autoFocus required
                error={!!errors.email} helperText={errors.email} fullWidth variant="outlined"
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                name="password" placeholder="••••••" type="password" id="password" autoComplete="current-password"
                required fullWidth variant="outlined" error={!!errors.password} helperText={errors.password}
              />
            </FormControl>
            
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
            <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Sign in'}
            </Button>
          </Box>

          <Divider>or</Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/auth/sign-up" variant="body2">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
