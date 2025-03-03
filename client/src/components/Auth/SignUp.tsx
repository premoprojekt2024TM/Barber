import { Box, Button, CssBaseline, Divider, FormLabel, FormControl, Link, TextField, Typography, Stack, Card as MuiCard, styled, ToggleButton, ToggleButtonGroup, FormHelperText } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; 
import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '100%', padding: theme.spacing(4), gap: theme.spacing(2),
  margin: 'auto', opacity: 0, transform: 'translateY(30px)', animation: `${fadeInUp} 0.6s ease-out forwards`,
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: { width: '450px' },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)', minHeight: '100%', padding: theme.spacing(2),
  display: 'flex', justifyContent: 'center', alignItems: 'center', animation: `${fadeInUp} 0.6s ease-out`,
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  '&::before': { content: '""', position: 'absolute', zIndex: -1, inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))' },
}));

interface AxiosErrorResponse {
  response?: {
    status: number;
    data: string;
  };
}

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'hairdresser'>('client');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>(''); 
  
  const navigate = useNavigate(); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordErrorMessage(''); 

    const formData = {
      username,
      email,
      password,
      role,
    };

    try {
      const response = await axiosInstance.post('/api/v1/register', formData);
    
      if (response.status === 201) {
        navigate('/login'); 
      } else {
        setPasswordErrorMessage('A regisztráció nem sikerült. Kérlek próbáld újra.');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      if (axiosError.response) {
        if (axiosError.response.status === 400) {
          setPasswordErrorMessage('Hibás adatok. Kérlek ellenőrizd a megadott információkat.');
        } else if (axiosError.response.status === 500) {
          setPasswordErrorMessage('A szerver hibát észlelt. Kérlek próbáld újra később.');
        } else {
          setPasswordErrorMessage('Ismeretlen hiba történt. Kérlek próbáld újra.');
        }
      } else {
        setPasswordErrorMessage('Hálózati hiba. Kérlek próbáld újra később.');
      }
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>Regisztráció</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="username">Felhasználónév</FormLabel>
              <TextField 
                name="username" 
                required 
                fullWidth 
                id="username" 
                placeholder="Felhasználónév"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField 
                required 
                fullWidth 
                id="email" 
                placeholder="nev@email.com" 
                name="email" 
                autoComplete="email" 
                variant="outlined"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </FormControl>
            <FormControl error={!!passwordErrorMessage}>
              <FormLabel htmlFor="password">Jelszó</FormLabel>
              <TextField 
                required 
                fullWidth 
                name="password" 
                placeholder="••••••••" 
                type="password" 
                id="password" 
                autoComplete="new-password" 
                variant="outlined"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              {passwordErrorMessage && <FormHelperText>{passwordErrorMessage}</FormHelperText>}
            </FormControl>

            <Box sx={{ mb: 2 }} /> 

            <ToggleButtonGroup 
              value={role} 
              exclusive 
              fullWidth 
              onChange={(_e, newRole) => setRole(newRole)} 
              sx={{ mb: 2 }}
            >
              <ToggleButton value="client" sx={{ flex: 1 }}>Kliens</ToggleButton>
              <ToggleButton value="worker" sx={{ flex: 1 }}>Fodrász</ToggleButton>
            </ToggleButtonGroup>

            <Button type="submit" fullWidth variant="contained">Regisztráció</Button>
          </Box>
          <Divider><Typography sx={{ color: 'text.secondary' }}>vagy</Typography></Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>Van már fiókod? <Link component={RouterLink} to="/login" variant="body2">Jelentkezz be</Link></Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}