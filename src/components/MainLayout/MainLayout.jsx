// src/components/MainLayout/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import NavigationTabs from '../NavigationTabs/NavigationTabs';
import ContentArea from '../ContentArea/ContentArea';
import Footer from '../Footer/Footer';
import InitialSetupModal from '../InitialSetupModal/InitialSetupModal'; // 引入初始化设置组件
import './MainLayout.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserPermissions,setRefreshPermissionFlag } from '../../redux/permission/permissionSlice';
import { fetchInitialSetupData, setCurrentStep } from '../../redux/initialSetupSlice/initialSetupSlice';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('Home'); // 设置默认标签
  const { userId, webSocketSuccess} = useSelector((state) => state.auth);
  const { permissionSuccess,refreshPermissionFlag } = useSelector((state) => state.permissions);
  const { showModal } = useSelector((state) => state.initialSetup);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeData = async () => {
      // alert("父组件1: " +"userId: "+ userId + " webSocketSuccess:" + webSocketSuccess+ " apiKey:" + apikey );
      if (userId && webSocketSuccess) {
        try {
          // alert("父组件2: " +"userId: "+ userId + " webSocketSuccess:" + webSocketSuccess );
          console.log('Fetching initialization data...');

          // Step 1: 获取初始化设置数据
          await dispatch(fetchInitialSetupData({ userId })).unwrap();     
           

          // Step 2: 获取用户权限
          if (refreshPermissionFlag){
            console.log('Fetching user permissions...');
            await dispatch(fetchUserPermissions()).unwrap();
            dispatch(setRefreshPermissionFlag(false)); // 设置刷新标志为 false    
            console.log('User permissions loaded.');
          }
          
        } catch (error) {
          console.error('Error during initialization:', error);
        }
      }
    };

    initializeData();
  }, [userId, webSocketSuccess,refreshPermissionFlag]);

  return (
    <div className="main-layout">
      <Header />
      <ContentArea activeTab={activeTab} />
      <Footer />

      {/* 显示初始化设置模态窗口 */}
      {showModal && <InitialSetupModal />}
    </div>
  );
};

export default MainLayout;
