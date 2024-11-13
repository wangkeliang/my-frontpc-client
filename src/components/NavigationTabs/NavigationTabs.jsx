// src/components/NavigationTabs/NavigationTabs.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../../redux/mainLayout/tabSlice';
import './NavigationTabs.css';

const NavigationTabs = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tab); // 从 Redux 中获取 activeTab

  return (
    <nav className="custom-navigation-tabs slds-tabs_default">
      <a onClick={() => dispatch(setActiveTab('Home'))} className={`custom-navigation-tab ${activeTab === 'Home' ? 'active' : ''}`}>ホーム</a>
      <a onClick={() => dispatch(setActiveTab('Case'))} className={`custom-navigation-tab ${activeTab === 'Case' ? 'active' : ''}`}>案件</a>
      <a onClick={() => dispatch(setActiveTab('Candidate'))} className={`custom-navigation-tab ${activeTab === 'Candidate' ? 'active' : ''}`}>人材</a>
      <a onClick={() => dispatch(setActiveTab('Partner'))} className={`custom-navigation-tab ${activeTab === 'Partner' ? 'active' : ''}`}>パートナ</a>
      <a onClick={() => dispatch(setActiveTab('Meeting'))} className={`custom-navigation-tab ${activeTab === 'Meeting' ? 'active' : ''}`}>会議</a>
      <a onClick={() => dispatch(setActiveTab('Mail'))} className={`custom-navigation-tab ${activeTab === 'Mail' ? 'active' : ''}`}>メール送信</a>
      <a onClick={() => dispatch(setActiveTab('Report'))} className={`custom-navigation-tab ${activeTab === 'Report' ? 'active' : ''}`}>レポート</a>
      <a onClick={() => dispatch(setActiveTab('BulletinBoard'))} className={`custom-navigation-tab ${activeTab === 'BulletinBoard' ? 'active' : ''}`}>掲示板</a>
    </nav>
  );
};

export default NavigationTabs;
