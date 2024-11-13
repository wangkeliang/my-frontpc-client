// src/components/MainLayout/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import NavigationTabs from '../NavigationTabs/NavigationTabs';
import ContentArea from '../ContentArea/ContentArea';
import Footer from '../Footer/Footer';
import InitialSetupModal from '../InitialSetupModal/InitialSetupModal'; // 引入初始化设置组件
import './MainLayout.css';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('Home'); // 设置默认标签
  const [showInitialSetup, setShowInitialSetup] = useState(false); // 控制初始化设置模态窗口的显示

  useEffect(() => {
    // 设置一个定时器，在 4 秒后显示初始化设置模态窗口
    const timer = setTimeout(() => {
      setShowInitialSetup(true);
    }, 1000);

    // 清除定时器
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="main-layout">
      <Header />
      {/* <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />*/}
      <ContentArea activeTab={activeTab} />
      <Footer />

      {/* 显示初始化设置模态窗口 */}
      {showInitialSetup && <InitialSetupModal />}
    </div>
  );
};

export default MainLayout;
