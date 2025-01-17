import React, { useState, useRef } from 'react';
import { Box, Typography, Modal, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlanPurchaseInput from '../PlanPurchaseInput/PlanPurchaseInput';
import PlanPurchaseConfirm from '../PlanPurchaseConfirm/PlanPurchaseConfirm';
import Payment from '../Payment/Payment';
import PaymentResult from '../PaymentResult/PaymentResult';
import { useDispatch } from 'react-redux';
import { fetchPlanPurchase } from '../../redux/planPurchase/planPurchaseSlice';
import ErrorHandler from '../../utils/ErrorHandler';

const PlanPurchase = ({ planCode, companyId }) => {
  const [currentStep, setCurrentStep] = useState(1); // 当前步骤
  const [purchaseData, setPurchaseData] = useState({
    effectiveImmediately: true,
    startDate: '',
    isAutoRenew: false,
    planDetails: null,
  }); // 初始化用户输入数据
  const [paymentResult, setPaymentResult] = useState(null); // 支付结果
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态窗口

  const dispatch = useDispatch();
  const inputRef = useRef(); // 引用 PlanPurchaseInput 子组件
  const confirmRef = useRef(); // 引用 PlanPurchaseConfirm 子组件

  // 打开模态窗口并加载数据
  const handleOpen = async () => {
    try {
      const fetchedPlanDetails = await dispatch(fetchPlanPurchase({ planCode, companyId })).unwrap();
      setPurchaseData((prev) => ({
        ...prev,
        planDetails: fetchedPlanDetails,
        startDate: fetchedPlanDetails.startDate || prev.startDate,
      }));
      setIsModalOpen(true);
    } catch (error) {
      ErrorHandler.doCatchedError(
        error,
        null,
        null,
        'popup',
        'throw',
        'PLAN_FETCH_ERROR'
      );
    }
  };

  // 关闭模态窗口
  const handleClose = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setPurchaseData({
      effectiveImmediately: true,
      startDate: '',
      isAutoRenew: false,
      planDetails: null,
    });
    setPaymentResult(null);
  };

  // 保存用户输入并进入下一步
  const handlePurchase = async () => {
    if (inputRef.current) {
      const result = await inputRef.current.saveChanges();
      if (result.checkError) {
        console.error('Input validation failed:', result.input);
        return;
      }
      setPurchaseData(result.input);
      setCurrentStep(2);
    }
  };

  // 确认购买并调用子组件方法
  const handleConfirmPurchase = async () => {
    if (confirmRef.current) {
      const result = await confirmRef.current.confirmPurchase();
      if (result.success) {
        console.log('Purchase success:', result.response);
        setCurrentStep(3); // 跳转到支付页面
      } else {
        console.error('Purchase failed:', result.error);
      }
    }
  };

  // 处理支付结果
  const handlePaymentComplete = (result) => {
    setPaymentResult(result);
    setCurrentStep(4);
  };

  return (
    <>
      {/* 触发按钮 */}
      <Button
        variant="contained"
        size="medium"
        sx={{
          backgroundColor: '#1a237e',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#0d47a1',
          },
        }}
        onClick={handleOpen}
      >
        購入
      </Button>

      {/* 模态窗口 */}
      <Modal
        open={isModalOpen}
        onClose={null}
        sx={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            width: '100%',
            // height: '100%',
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // 黑色半透明背景
            // zIndex: 1300, // 确保蒙层在最上层
            overflow: 'auto',
        }}
        >
        <Box
            sx={{
            position: 'fixed',
            top: '10%', // 保证弹窗顶部有一定间距
            //   bottom: '10%', // 保证弹窗顶部有一定间距
            left: '50%',
            transform: 'translateX(-50%)',
            width: '620px',
            //   maxHeight: 'calc(100vh - 20px)', // 最大高度限制在视口内，但留出边距
            overflow: 'visible', // 防止内容被裁剪
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: '8px',
            p: 4,
            }}
        >
            <IconButton
            onClick={handleClose}
            sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: '#1a237e',
            }}
            >
            <CloseIcon />
            </IconButton>

            {/* 内容区域 */}
            <Box>
            {currentStep === 1 && (
                <PlanPurchaseInput
                ref={inputRef}
                planDetails={purchaseData.planDetails}
                effectiveImmediately={purchaseData.effectiveImmediately}
                startDate={purchaseData.startDate}
                isAutoRenew={purchaseData.isAutoRenew}
                onSave={(data) => setPurchaseData((prev) => ({ ...prev, ...data }))}
                />
            )}
            {currentStep === 2 && (
                <PlanPurchaseConfirm
                ref={confirmRef}
                purchaseData={purchaseData}
                />
            )}
            {currentStep === 3 && (
                <Payment
                purchaseData={purchaseData}
                onPaymentComplete={handlePaymentComplete}
                />
            )}
            {currentStep === 4 && (
                <PaymentResult result={paymentResult} onClose={handleClose} />
            )}
            </Box>

            {/* 底部按钮 */}
            <Box
            sx={{
                textAlign: 'right',
                mt: 2,
            }}
            >
            {currentStep === 1 && (
                <Button variant="contained" onClick={handlePurchase}>
                購入
                </Button>
            )}
            {currentStep === 2 && (
                <>
                <Button variant="outlined" onClick={() => setCurrentStep(1)} sx={{ mr: 2 }}>
                    戻る
                </Button>
                <Button variant="contained" onClick={handleConfirmPurchase}>
                    確認
                </Button>
                </>
            )}
            {currentStep === 3 && (
                <>
                <Button
                    variant="outlined"
                    onClick={() => handlePaymentComplete({ status: 'later' })}
                    sx={{ mr: 2 }}
                >
                    後で支払
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handlePaymentComplete({ status: 'success' })}
                >
                    支払
                </Button>
                </>
            )}
            {currentStep === 4 && (
                <Button variant="contained" onClick={handleClose}>
                完了
                </Button>
            )}
            </Box>
        </Box>
      </Modal>


    </>
  );
};

export default PlanPurchase;
