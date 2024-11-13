// src/components/ContentArea/ContentArea.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import Home from '../Home/Home';
import Case from '../Case/Case';
import Candidate from '../Candidate/Candidate';
import Partner from '../Partner/Partner';
import Meeting from '../Meeting/Meeting';
import Mail from '../Mail/Mail';
import Report from '../Report/Report';
import BulletinBoard from '../BulletinBoard/BulletinBoard';
import './ContentArea.css';

const ContentArea = () => {
  const activeTab = useSelector((state) => state.tab); // 从 Redux 中获取 activeTab

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home />;
      case 'Case':
        return <Case />;
      case 'Candidate':
        return <Candidate />;
      case 'Partner':
        return <Partner />;
      case 'Meeting':
        return <Meeting />;
      case 'Mail':
        return <Mail />;
      case 'Report':
        return <Report />;
      case 'BulletinBoard':
        return <BulletinBoard />;
      default:
        return <Home />;
    }
  };

  return <div className="content-area">{renderContent()}</div>;
};

export default ContentArea;
