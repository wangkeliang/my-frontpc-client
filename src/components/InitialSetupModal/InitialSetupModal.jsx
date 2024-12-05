import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PersonalInfoStep from '../PersonalInfoStep/PersonalInfoStep';
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
import { useUserMenu } from '../../services/UserMenuService';

const InitialSetupModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleLogout } = useUserMenu(); // 引用 handleLogout 方法

  // 从 Redux Store 中获取状态
  const { currentStep, steps, error } = useSelector((state) => state.initialSetup);
  const userId = useSelector((state) => state.auth?.userId); // 从 auth 中获取 userId
  const { webSocketSuccess } = useSelector((state) => state.auth);

  const [stepComponents, setStepComponents] = useState([]);
  const personalInfoRef = useRef(null); // 定义 ref，用于保存 PersonalInfoStep 的方法
  const companyInfoRef = useRef(null); // 定义 ref，用于保存 CompanyInfoStep 的方法
  const completionRef = useRef(null);
  const applicationInfoRef = useRef(null);

  // // 初始化数据加载
  useEffect(() => {
    const initializeSetupData = async () => {  
      // alert("子组件1: " +"userId: "+ userId + " webSocketSuccess:" + webSocketSuccess );
      if (userId && webSocketSuccess) {
        // alert("子组件2: " +"userId: "+ userId + " webSocketSuccess:" + webSocketSuccess );
        try {
          if (!userId) {
            return;
          }
          console.log('*** Initial setup data loading starts ***');
          const userInfo = await dispatch(fetchUserInfo(userId)).unwrap();

          const fetchedCompanyId = userInfo.companyId;
          const userType = userInfo.userType;

          await dispatch(fetchManagerInfo(userId)).unwrap();
          await dispatch(fetchUserRoles(userId)).unwrap();
          await dispatch(fetchRoleApplications(userId)).unwrap();

          if (fetchedCompanyId) {
            await dispatch(fetchCompanyInfo(fetchedCompanyId)).unwrap();
            await dispatch(fetchCompanyMembers(fetchedCompanyId)).unwrap();
            await dispatch(fetchCompanyAdmins(fetchedCompanyId)).unwrap();
          }

          if (userType) {
            await dispatch(fetchRoleMaster(userType)).unwrap();
          }
          console.log('*** Initial setup data loading completed ***');
        } catch (error) {
          console.error('Error during setup:', error);
        }
      }
    };

    initializeSetupData();
  }, [dispatch, userId,webSocketSuccess]);

  // 错误导航处理
  useEffect(() => {
    console.log('***initial setup modal error=',error);
    if (error) {
      // navigate('/error');
    }
  }, [error, navigate]);

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
      try {
        // 获取最新的 userInfo
        const userInfo = await dispatch(fetchUserInfo(userId)).unwrap();
        // 根据 applicationStatus 执行后续操作
        if (userInfo.applicationStatus === 'approved') {
          
          dispatch(setRefreshPermissionFlag(true)); // 设置刷新标志为 true
          // 如果已批准，则关闭模态框
          dispatch({ type: 'initialSetup/hideModal' });
          
        } else {
          handleLogout();
          // dispatch({ type: 'initialSetup/hideModal' });
        }
        return;
      } catch (error) {
        console.error('Error fetching user info during completion:', error);
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <StepIndicator currentStep={currentStep} labels={stepComponents.map(item => item.label)} />
        <div className="modal-content">{stepComponents[currentStep]?.component}</div>
        <div className="modal-footer">
          {currentStep > 0 && steps[currentStep] !== 'Completion' && (
            <button className="btn-back" onClick={() => dispatch(setCurrentStep(currentStep - 1))}>
              戻る
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button className="btn-next" onClick={handleNextStep}>
              次へ
            </button>
          )}
          {currentStep === stepComponents.length - 1 && (
            <button className="btn-finish" onClick={handleNextStep}>
              完了
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialSetupModal;
