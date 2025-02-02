import * as React from 'react';
import { Box, Button, Typography, Avatar, TextField, Stack, Card as MuiCard } from '@mui/material';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme'; // Reapply AppTheme import

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function VerificationPage() {
  const [profilePic, setProfilePic] = React.useState<File | null>(null);
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setProfilePic(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle the form submission logic here (e.g., API calls)
    console.log({
      firstName,
      lastName,
      profilePic,
    });
  };

  return (
    <AppTheme> {/* Reapply AppTheme here */}
      <Box
        sx={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Card variant="outlined">
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack direction="column" spacing={3}>
              <Typography variant="h4" gutterBottom align="center">
                User Verification
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph align="center">
                Please verify your account by completing the form below. This helps us ensure your account is secure and properly authenticated.
              </Typography>

              {/* Profile Picture Upload */}
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <Avatar
                  sx={{ width: 80, height: 80 }}
                  src={profilePic ? URL.createObjectURL(profilePic) : "https://via.placeholder.com/80"} // Show uploaded image or placeholder
                />
                <Button variant="outlined" component="label">
                  Upload Profile Picture
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              </Stack>

              {/* First Name Input (No Label) */}
              <TextField
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: false }} // Disable label
              />

              {/* Last Name Input (No Label) */}
              <TextField
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: false }} // Disable label
              />

              {/* Verification Status */}
              <Typography variant="h6" gutterBottom>
                Verification Status
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Current Status: <strong>Not Verified</strong>
              </Typography>

              {/* Submit Button */}
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                <Button variant="outlined" color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card>
      </Box>
    </AppTheme>
  );
}
