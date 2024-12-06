import React from 'react';
import { Box, Typography, Link, Grid } from '@mui/material';
import RegistrationFormCmp from '../../components/RegistrationFormCmp/RegistrationFormCmp';
import LoginSection from '../../components/LoginSection/LoginSection';

const RegisterPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        padding: 3,
      }}
    >
      <RegistrationFormCmp />
      <LoginSection />
    </Box>
  );
};

export default RegisterPage;
