import * as React from 'react';
import { Box, Button, Checkbox, CssBaseline, Divider, FormControlLabel, FormLabel, FormControl, Link, TextField, Typography, Stack, Card as MuiCard, styled, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; 
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { registerSchema } from '../../../server/src/shared/validation/userValidation'; 
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
  [theme.breakpoints.up('sm')]: { width: '450px' },
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)', minHeight: '100%', padding: theme.spacing(2),
  display: 'flex', justifyContent: 'center', alignItems: 'center', animation: `${fadeInUp} 0.6s ease-out`,
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  '&::before': { content: '""', position: 'absolute', zIndex: -1, inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))', ...theme.applyStyles('dark', { backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))', }) },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [userRole, setUserRole] = React.useState<string>('client'); 
  const navigate = useNavigate();


  React.useEffect(() => {
    const authToken = Cookies.get('auth_token');
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken); 
        if (decodedToken.role === 'client') {
          navigate('/auth/client');  
        } else if (decodedToken.role === 'hairdresser') {
          navigate('/auth/hair');  
        }
      } catch (error) {
        Cookies.remove('auth_token'); 
      }
    }
  }, [navigate]);

  const handleRoleChange = (event: React.MouseEvent<HTMLElement>, newRole: string) => {
    setUserRole(newRole);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = { 
      username: data.get('username') as string, 
      email: data.get('email') as string, 
      password: data.get('password') as string,
      role: userRole 
    };
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const validationErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => validationErrors[err.path[0]] = err.message);
      setErrors(validationErrors);
    } else {
      try {
        setIsSubmitting(true);
        const response = await axiosInstance.post('/api/register', formData);
        console.log('Registration successful', response.data);
        navigate('/auth/sign-in');
      } catch (error) {
        console.error('Error registering:', error);
        setErrors({ api: 'Registration failed, please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>Sign up</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="username">User Name</FormLabel>
              <TextField name="username" required fullWidth id="username" placeholder="JonSnow" error={!!errors.username} helperText={errors.username} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField required fullWidth id="email" placeholder="your@email.com" name="email" autoComplete="email" variant="outlined" error={!!errors.email} helperText={errors.email} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField required fullWidth name="password" placeholder="••••••••••••" type="password" id="password" autoComplete="new-password" variant="outlined" error={!!errors.password} helperText={errors.password} />
            </FormControl>
            <FormControlLabel control={<Checkbox value="allowExtraEmails" color="primary" />} label="I want to receive updates via email." />
            
            <ToggleButtonGroup value={userRole} exclusive onChange={handleRoleChange} fullWidth sx={{ mb: 2 }}>
              <ToggleButton value="client" sx={{ flex: 1 }}>Client</ToggleButton>
              <ToggleButton value="hairdresser" sx={{ flex: 1 }}>Hairdresser</ToggleButton>
            </ToggleButtonGroup>

            
            <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Sign up'}</Button>
          </Box>
          <Divider><Typography sx={{ color: 'text.secondary' }}>or</Typography></Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>Already have an account? <Link component={RouterLink} to="/auth/sign-in" variant="body2">Sign In</Link></Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
