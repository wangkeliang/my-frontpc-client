// src/components/Header/Logo.jsx
import React from 'react';
import './Logo.css';

const Logo = () => (
  <div className="logo-container">
    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="logo" />
  </div>
);

export default Logo;
