import React, { useState, useRef } from 'react';
import { Box, Typography, Modal, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlanPurchaseInput from '../PlanPurchaseInput/PlanPurchaseInput';
import PlanPurchaseConfirm from '../PlanPurchaseConfirm/PlanPurchaseConfirm';
import Payment from '../Payment/Payment';
import PaymentResult from '../PaymentResult/PaymentResult';

const PlanPurchase = ({ planCode, companyId }) => {
  const [currentStep, setCurrentStep] = useState(1); // 当前步骤
  const [purchaseData, setPurchaseData] = useState({}); // 保存购买输入数据
  const [paymentResult, setPaymentResult] = useState(null); // 支付结果
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态窗口

  const inputRef = useRef(); // 引用子组件

  // 打开模态窗口
  const handleOpen = () => {
    setIsModalOpen(true);
  };

  // 关闭模态窗口
  const handleClose = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setPurchaseData({});
    setPaymentResult(null);
  };

  // 点击购买按钮时调用子组件方法获取数据
  const handlePurchase = async () => {
    if (inputRef.current) {
      const result = await inputRef.current.saveChanges(); // 调用子组件方法
  
      if (result.checkError) {
        // 如果有错误，不执行后续操作
        console.error('Input validation failed:', result.input);
        return;
      }
  
      // 保存正确的输入数据并进入下一步
      setPurchaseData(result.input);
      setCurrentStep(2); // 跳转到确认页面
    }
  };
  

  // 处理支付结果并跳转到支付结果页面
  const handlePaymentComplete = (result) => {
    setPaymentResult(result);
    setCurrentStep(4); // 跳转到 PaymentResult 页面
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
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          overflowY: 'auto', // 启用纵向滚动条
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '620px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: '8px',
            p: 4,
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* 右上角关闭按钮 */}
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

          {/* 子组件显示 */}
          {currentStep === 1 && (
            <PlanPurchaseInput ref={inputRef} planCode={planCode} companyId={companyId} />
          )}
          {currentStep === 2 && <PlanPurchaseConfirm purchaseData={purchaseData} />}
          {currentStep === 3 && (
            <Payment purchaseData={purchaseData} onPaymentComplete={handlePaymentComplete} />
          )}
          {currentStep === 4 && <PaymentResult result={paymentResult} onClose={handleClose} />}

          {/* 按钮 */}
          <Box sx={{ textAlign: 'right', mt: 2 }}>
            {currentStep === 1 && (
              <Button variant="contained" onClick={handlePurchase}>
                購入
              </Button>
            )}
            {currentStep === 2 && (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setCurrentStep(1)}
                  sx={{ mr: 2 }}
                >
                  戻る
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setCurrentStep(3)}
                >
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
