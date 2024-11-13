// src/pages/RegisterPage/RegisterPage.jsx
import React from 'react';
import RegistrationFormCmp from '../../components/RegistrationFormCmp/RegistrationFormCmp';
import LoginSection from '../../components/LoginSection/LoginSection';
const RegisterPage = () => {
  return (
    <div>
      <RegistrationFormCmp />
    　 <LoginSection />
    </div>
  );
};

export default RegisterPage;
