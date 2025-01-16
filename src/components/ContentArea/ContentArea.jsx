import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../Home/Home';
import Case from '../Case/Case';
import Candidate from '../Candidate/Candidate';
import Partner from '../Partner/Partner';
import Meeting from '../Meeting/Meeting';
import Mail from '../Mail/Mail';
import Report from '../Report/Report';
import BulletinBoard from '../BulletinBoard/BulletinBoard';
import AccountSetting from '../AccountSetting/AccountSetting'; // 引入 AccountSetting
import './ContentArea.css';

const ContentArea = () => {
  return (
    <div className="content-area">
      <Routes>
        <Route path="/" element={<Navigate to="Home" replace />} /> {/* 默认显示 Home */}
        <Route path="Home" element={<Home />} />
        <Route path="Case" element={<Case />} />
        <Route path="Candidate" element={<Candidate />} />
        <Route path="Partner" element={<Partner />} />
        <Route path="Meeting" element={<Meeting />} />
        <Route path="Mail" element={<Mail />} />
        <Route path="Report" element={<Report />} />
        <Route path="BulletinBoard" element={<BulletinBoard />} />
        <Route path="Account/*" element={<AccountSetting />} /> {/* 匹配 Account 及其子路由 */}
      </Routes>
    </div>
  );
};

export default ContentArea;
