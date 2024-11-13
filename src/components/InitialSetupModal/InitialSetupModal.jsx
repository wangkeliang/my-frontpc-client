import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import { fetchInitialSetupData, setCurrentStep } from '../../redux/initialSetupSlice/initialSetupSlice';
import StepIndicator from '../StepIndicator/StepIndicator';
import WelcomeStep from '../WelcomeStep/WelcomeStep';
import PersonalInfoStep from '../PersonalInfoStep/PersonalInfoStep';
import CompanyInfoStep from '../CompanyInfoStep/CompanyInfoStep';
import ApplicationStep from '../ApplicationStep/ApplicationStep';
import CompletionStep from '../CompletionStep/CompletionStep';
import './InitialSetupModal.css';

// 英文到日文的映射对象
const stepLabelMap = {
  'Welcome': 'ようこそ',
  'PersonalInfo': '個人情報',
  'CompanyInfo': '会社情報',
  'ApplicationInfo': '申請情報',
  'Completion': '完了',
};

const InitialSetupModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 使用 useNavigate
  const { currentStep, showModal, steps, isLoading, error } = useSelector((state) => state.initialSetup);

  useEffect(() => {
    dispatch(fetchInitialSetupData());
    console.log('Initial setup data fetch initiated');
  }, [dispatch]);

  // 如果 error 存在，导航到错误页面
  useEffect(() => {
    if (error) {
      navigate('/error'); // 导航到错误页面
    }
  }, [error, navigate]);

  console.log('showModal value before rendering:', showModal);
  console.log('steps array:', steps); // 调试日志，检查 steps 数组

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  if (!showModal) {
    return null; // 如果 showModal 为 false，则不显示
  }

  // 动态映射步骤标签到对应的组件
  const stepComponentMap = {
    'Welcome': <WelcomeStep />,
    'PersonalInfo': <PersonalInfoStep />,
    'CompanyInfo': <CompanyInfoStep />,
    'ApplicationInfo': <ApplicationStep />,
    'Completion': <CompletionStep />,
  };

  // 使用英文标签从 `stepComponentMap` 获取组件，并用日文标签显示
  const stepComponents = steps.map((stepLabel) => {
    const component = stepComponentMap[stepLabel]; // 获取对应的组件
    const japaneseLabel = stepLabelMap[stepLabel] || stepLabel; // 获取日文标签
    return { component, label: japaneseLabel };
  }).filter(item => item.component); // 过滤掉无效的组件

  // 调试日志，检查 stepComponents 是否正确生成
  console.log('stepComponents:', stepComponents);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <StepIndicator currentStep={currentStep} labels={stepComponents.map(item => item.label)} />
        {stepComponents.length > 0 && ( // 确保 stepComponents 不为空
          <div className="modal-content">{stepComponents[currentStep].component}</div>
        )}
        <div className="modal-footer">
          {currentStep > 0 && <button onClick={handlePrevious}>Back</button>}
          {currentStep < stepComponents.length - 1 && <button onClick={handleNext}>Next</button>}
          {currentStep === stepComponents.length - 1 && (
            <button onClick={() => {/* Close Modal Logic */}}>Finish</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialSetupModal;
