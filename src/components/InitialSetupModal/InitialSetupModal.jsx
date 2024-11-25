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
import StepIndicator from '../StepIndicator/StepIndicator';
import WelcomeStep from '../WelcomeStep/WelcomeStep';
import CompanyInfoStep from '../CompanyInfoStep/CompanyInfoStep';
import ApplicationStep from '../ApplicationStep/ApplicationStep';
import CompletionStep from '../CompletionStep/CompletionStep';
import './InitialSetupModal.css';

const InitialSetupModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 从 Redux Store 中获取状态
  const { currentStep, showModal, steps, error } = useSelector((state) => state.initialSetup);
  const userId = useSelector((state) => state.auth?.userId); // 从 auth 中获取 userId

  const [stepComponents, setStepComponents] = useState([]);
  const personalInfoRef = useRef(null); // 定义 ref，用于保存 PersonalInfoStep 的方法
  const companyInfoRef = useRef(null); // 定义 ref，用于保存 CompanyInfoStep 的方法
  const completionRef= useRef(null);

  // 初始化数据加载
  useEffect(() => {
    const initializeSetupData = async () => {
      try {
        console.log('*** Initial setup data loading starts ***');

        // 1. 获取初始化设置数据
        const initialSetupResponse = await dispatch(fetchInitialSetupData(userId)).unwrap();
        console.log('Initial setup response:', initialSetupResponse);

        // 2. 调用 fetchUserInfo 提取 userInfo
        const userInfo = await dispatch(fetchUserInfo(userId)).unwrap();
        console.log('Fetched userInfo:', userInfo);

        // 提取 companyId 和 userType
        const fetchedCompanyId = userInfo.companyId;
        const userType = userInfo.userType;

        // 3. 加载用户信息
        await dispatch(fetchManagerInfo(userId)).unwrap();
        await dispatch(fetchUserRoles(userId)).unwrap();
        await dispatch(fetchRoleApplications(userId)).unwrap();

        // 4. 加载公司信息
        if (fetchedCompanyId) {
          await dispatch(fetchCompanyInfo(fetchedCompanyId)).unwrap();
          await dispatch(fetchCompanyMembers(fetchedCompanyId)).unwrap();
          await dispatch(fetchCompanyAdmins(fetchedCompanyId)).unwrap();
        } else {
          console.warn('Company ID is missing. Skipping company-related data fetching.');
        }

        // 5. 加载角色数据
        if (userType) {
          await dispatch(fetchRoleMaster(userType)).unwrap();
        } else {
          console.warn('User type is undefined. Skipping role master fetching.');
        }
        console.log('*** Initial setup data loading completed ***');
      } catch (error) {
        console.error('Error during setup:', error);
      }
    };

    initializeSetupData();
  }, [dispatch, userId]);

  // 错误导航处理
  useEffect(() => {
    if (error) {
      navigate('/error');
    }
  }, [error, navigate]);

  // 获取步骤组件及其标签
  useEffect(() => {
    if (!steps || steps.length === 0) {
      console.warn('No steps defined. Skipping step components initialization.');
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
      PersonalInfo: <PersonalInfoStep ref={personalInfoRef} />, // 传递 ref
      CompanyInfo: <CompanyInfoStep ref={companyInfoRef} />, 
      ApplicationInfo: <ApplicationStep />, 
      Completion: <CompletionStep ref={completionRef}/>,
    };

    const components = steps
      .map((stepLabel) => {
        const component = stepComponentMap[stepLabel];
        const japaneseLabel = stepLabelMap[stepLabel] || stepLabel;
        return { component, label: japaneseLabel };
      })
      .filter(item => item.component);

    setStepComponents(components);
  }, [steps]);

  if (!showModal) {
    return null;
  }

  // 处理下一步逻辑
  const handleNextStep = async () => {
    console.log('***steps[currentStep]',steps[currentStep]);
    console.log('***completionRef.current',completionRef.current);
    if (steps[currentStep] === 'PersonalInfo' && personalInfoRef.current) {
      console.log('Saving personal info...');
      const success = await personalInfoRef.current.saveChanges();
      if (!success) {
        console.warn('Failed to save personal info. Staying on current step.');
        return;
      }
    }

    if (steps[currentStep] === 'CompanyInfo' && companyInfoRef.current) {
      console.log('Saving company info...');
      const success = await companyInfoRef.current.saveChanges();
      if (!success) {
        console.warn('Failed to save company info. Staying on current step.');
        return;
      }
    }

    if (steps[currentStep] === 'Completion' && completionRef.current) {
      console.log('Completion...');
      console.log('Setup completed');
      dispatch({ type: 'initialSetup/hideModal' }); 
      // dispatch(setCurrentStep(0)); // 重置步骤到第一个
      // dispatch({ type: 'initialSetup/hideModal' }); // 隐藏模态窗口
      return; // 阻止进一步处理
    }

    if (currentStep < steps.length - 1) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <StepIndicator currentStep={currentStep} labels={stepComponents.map(item => item.label)} />
        {stepComponents.length > 0 && (
          <div className="modal-content">{stepComponents[currentStep].component}</div>
        )}
        <div className="modal-footer">
          {currentStep > 0 && steps[currentStep] !== 'Completion' && (
            <button className="btn-back" onClick={() => dispatch(setCurrentStep(currentStep - 1))}>
              Back
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button className="btn-next" onClick={handleNextStep}>
              Next
            </button>
          )}
          {currentStep === stepComponents.length - 1 && (
            <button className="btn-finish" onClick={handleNextStep}>
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialSetupModal;