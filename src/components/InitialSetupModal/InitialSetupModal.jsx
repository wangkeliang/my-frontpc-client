import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PersonalInfoStep from '../PersonalInfoStep/PersonalInfoStep';
import { Box, Paper, Button } from '@mui/material';
import {
  fetchInitialSetupData,
  setCurrentStep
} from '../../redux/initialSetupSlice/initialSetupSlice';
import {
  fetchUserInfo,
  fetchManagerInfo,
  fetchUserRoles,
  fetchRoleApplications
} from '../../redux/user/userSlice';
import {
  fetchCompanyInfo,
  fetchCompanyMembers,
  fetchCompanyAdmins
} from '../../redux/company/companySlice';
import { fetchRoleMaster } from '../../redux/master/masterSlice';
import { fetchUserPermissions, setRefreshPermissionFlag } from '../../redux/permission/permissionSlice';
import StepIndicator from '../StepIndicator/StepIndicator';
import WelcomeStep from '../WelcomeStep/WelcomeStep';
import CompanyInfoStep from '../CompanyInfoStep/CompanyInfoStep';
import ApplicationInfoStep from '../ApplicationInfoStep/ApplicationInfoStep';
import CompletionStep from '../CompletionStep/CompletionStep';
import './InitialSetupModal.css';
import { useUserMenu } from '../../services/logoutHandler';
import { handleLogout } from '../../services/logoutHandler';
import { GlobalPopupError } from "../../utils/GlobalPopupError"; // 引入 GlobalPopupError 类
import { useErrorBoundary } from "react-error-boundary"; // 错误边界
import { setPopupError } from "../../redux/popupError/popupError"; // 引入 Popup 错误处理
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError 类
import ErrorHandler from '../../utils/ErrorHandler';

const InitialSetupModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [localError, setLocalError] = useState(null);

  // 从 Redux Store 中获取状态
  const { currentStep, steps, error } = useSelector((state) => state.initialSetup);
  const userId = useSelector((state) => state.auth?.userId); // 从 auth 中获取 userId
  const userInfo = useSelector((state) => state.user.userInfo);
  const { webSocketSuccess } = useSelector((state) => state.auth);

  const [stepComponents, setStepComponents] = useState([]);
  const personalInfoRef = useRef(null); // 定义 ref，用于保存 PersonalInfoStep 的方法
  const companyInfoRef = useRef(null); // 定义 ref，用于保存 CompanyInfoStep 的方法
  const completionRef = useRef(null);
  const applicationInfoRef = useRef(null);
  const roleMaster = useSelector((state) => state.master?.roleMaster || []);
  // // 初始化数据加载
  useEffect(() => {
    const initializeSetupData = async () => {
      if (userId && webSocketSuccess) {
        console.log('*** Initial setup data loading starts ***');
        
        try {
          const fetchedCompanyId = userInfo?.companyId;
          const userType = userInfo?.userType;
  
          if (!userId) {
            return; // 如果 userId 不存在，则提前返回
          }
  
          console.log('***fetchManagerInfo is called');
          await dispatch(fetchManagerInfo(userId)).unwrap();
  
          console.log('***fetchUserRoles is called');
          await dispatch(fetchUserRoles(userId)).unwrap();
  
          console.log('***fetchRoleApplications is called');
          await dispatch(fetchRoleApplications(userId)).unwrap();
  
          if (fetchedCompanyId) {
            console.log('***fetchCompanyInfo is called');
            await dispatch(fetchCompanyInfo(fetchedCompanyId)).unwrap();
  
            console.log('***fetchCompanyMembers is called');
            await dispatch(fetchCompanyMembers(fetchedCompanyId)).unwrap();
  
            console.log('***fetchCompanyAdmins is called');
            await dispatch(fetchCompanyAdmins(fetchedCompanyId)).unwrap();
          }
  
          console.log('***fetchRoleMaster is called');
          await dispatch(fetchRoleMaster(userType)).unwrap();
  
          console.log('#####roleMaster=', roleMaster);
          console.log('*** Initial setup data loading completed ***');
        } catch (error) {
          console.error('Error during setup:', error);
          ErrorHandler.doCatchedError(
            error,
            setLocalError,       // 本地错误处理函数
            showBoundary,        // 错误边界处理函数
            'popup',             // GlobalPopupError 处理方式
            'throw',             // 其他错误处理方式
            'SYSTEM_ERROR'       // 默认错误代码
          );
        }
      }
    };
  
    // 调用异步函数
    initializeSetupData();
  }, [dispatch, userId, webSocketSuccess, userInfo, showBoundary]);
  



  // 获取步骤组件及其标签
  useEffect(() => {
    console.log('**steps=',steps);
    if (!Array.isArray(steps) || steps.length === 0) {
      console.warn('Steps is not defined or empty.');
      setStepComponents([]);
      return;
    }

    const stepLabelMap = {
      Welcome: 'ようこそ',
      PersonalInfo: '個人情報',
      CompanyInfo: '会社情報',
      ApplicationInfo: '申請情報',
      Completion: '完了',
    };

    const stepComponentMap = {
      Welcome: <WelcomeStep />,
      PersonalInfo: <PersonalInfoStep ref={personalInfoRef} />,
      CompanyInfo: <CompanyInfoStep ref={companyInfoRef} />,
      ApplicationInfo: <ApplicationInfoStep ref={applicationInfoRef}/>,
      Completion: <CompletionStep ref={completionRef} />,
    };

    const components = steps
      .map((stepLabel) => ({
        component: stepComponentMap[stepLabel],
        label: stepLabelMap[stepLabel] || stepLabel,
      }))
      .filter(item => item.component);

    setStepComponents(components);
  }, [steps]);


  const handleNextStep = async () => {
    try{
      if (steps[currentStep] === 'PersonalInfo' && personalInfoRef.current) {
        const success = await personalInfoRef.current.saveChanges();
        if (!success) return;
      }
  
      if (steps[currentStep] === 'CompanyInfo' && companyInfoRef.current) {
        const success = await companyInfoRef.current.saveChanges();
        if (!success) return;
      }
  
      if (steps[currentStep] === 'ApplicationInfo' && applicationInfoRef.current) {
        const success = await applicationInfoRef.current.saveApplication();
        if (!success) return;
      }
  
      if (steps[currentStep] === 'Completion' && completionRef.current) {
          const userInfo = await dispatch(fetchUserInfo(userId)).unwrap();
          // 根据 applicationStatus 执行后续操作
          if (userInfo.applicationStatus === 'approved') {
            
            await dispatch(fetchUserPermissions()).unwrap();
            
            // 如果已批准，则关闭模态框
            dispatch({ type: 'initialSetup/hideModal' });
            
          } else {
            handleLogout(dispatch);
            // dispatch({ type: 'initialSetup/hideModal' });
          }
          return;
      }
      if (currentStep < steps.length - 1) {
        dispatch(setCurrentStep(currentStep + 1));
      }

    }catch(error){
      ErrorHandler.doCatchedError(
        error,
        setLocalError,       // 本地错误处理函数
        showBoundary,   // 错误边界处理函数
        'popup',             // GlobalPopupError 处理方式
        'popup',             // 其他错误处理方式
        'SYSTEM_ERROR'       // 默认错误代码
      );
    }
    
  };

  return (
    <Box
    sx={{
      mt:2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      overflow: 'auto', // 添加自动滚动
      minHeight: '100vh', // 让内容至少占满屏幕高度
      padding: '16px', // 添加内边距，避免内容贴边
    }}
  >
    <Paper
      elevation={3}
      sx={{
        mt:4,
        width: '60%',
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        height: '88vh',  // 固定高度
        overflow: 'hidden', // 防止内容溢出
        maxHeight: '95vh', // 设置最大高度
        overflow: 'auto', // 防止内容溢出时内部滚动
        // backgroundColor:'blue',
      }}
    >
      <StepIndicator currentStep={currentStep} labels={stepComponents.map((item) => item.label)} />
      <Box sx={{ flex: 1, marginTop: 2 }}>{stepComponents[currentStep]?.component}</Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        {currentStep > 0 && (
          <Button variant="outlined" onClick={() => dispatch(setCurrentStep(currentStep - 1))}>
            戻る
          </Button>
        )}
        <Button variant="contained" onClick={handleNextStep}>
          {currentStep === stepComponents.length - 1 ? '完了' : '次へ'}
        </Button>
      </Box>
    </Paper>
  </Box>
  );
};
export default InitialSetupModal;