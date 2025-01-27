/* global Fincode */
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { initFincode, registerCard } from "@fincode/js";
import { useSelector } from "react-redux";
import ErrorHandler from "../../utils/ErrorHandler"; // 假设ErrorHandler在这个路径下
import { useErrorBoundary } from "react-error-boundary"; // 错误边界
import ErrorMap from '../../utils/ErrorMap';
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError 类
const PaymentCreditCardAdd = ({ open, onClose, onCardAdded }) => {
  const { showBoundary } = useErrorBoundary();
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fincodeUIId = "fincode-ui-container";
  const fincodeRef = useRef(null);
  const uiRef = useRef(null);
  const { customerData } = useSelector((state) => state.finCode);

  // 初始化 Fincode 对象
  useEffect(() => {
    const fincodePublicKey =
      "p_test_YzdjM2I3ODEtZjI3My00MWE3LTg1MWYtOTZmZDdmYTZiMDAyYjcxNjIyOWMtZDYwZi00YjI1LWE3ZjAtYWE2ODMzNDMyNzQ2c18yNTAxMTgzNTE0Mg";

    const initializeFincode = async () => {
      try {
        setLocalError(null);
        if (!fincodeRef.current) {
          fincodeRef.current = await initFincode({
            publicKey: fincodePublicKey,
            isLiveMode: false, // 设置为 true 表示生产环境
          });
        }

        if (open) {
          requestAnimationFrame(() => {
            uiRef.current = fincodeRef.current.ui({ layout: "horizontal" });
            uiRef.current.create("payment", { layout: "horizontal" });
            uiRef.current.mount(fincodeUIId, "455");
          });
        }
      } catch (error) {
        ErrorHandler.doCatchedError(
          error,
          setLocalError, // 本地错误处理函数
          showBoundary, // 错误边界处理函数
          "popup", // GlobalPopupError 处理方式
          "throw", // 其他错误处理方式
          "SYSTEM_ERROR" // 默认错误代码
        );
      }
    };

    initializeFincode();
  }, [open]);

  // 提交信用卡信息到 Fincode
  const handleSubmit = async () => {
    try {
      console.log('***handleSubmit is begin');
      setLoading(true);
      setLocalError(null);
      console.log('***customerData=',customerData);
      if (!customerData?.customer_id) {
        console.log('***顧客情報');
        setLoading(false);
        throw new LocalError({errorMessage:'顧客情報が見つかりました、システム管理者魔でご連絡ください。'});
        
      }    
      const formData = await uiRef.current.getFormData();
      await registerCard({
        fincode: fincodeRef.current,
        ui: uiRef.current,
        customerId: customerData.customer_id,
        useDefault: true,
      });
      await onCardAdded();
      onClose();
    } catch (error) {
      console.log('***catch error=',error);
      if (error?.errors?.[0]?.error_code?.startsWith('E')) {
        setLocalError(new LocalError({ errorMessage: error?.errors[0].error_message }));
      }else{
          ErrorHandler.doCatchedError(
          error,
          setLocalError, // 本地错误处理函数
          showBoundary, // 错误边界处理函数
          "popup", // GlobalPopupError 处理方式
          "throw", // 其他错误处理方式
          "SYSTEM_ERROR" // 默认错误代码
        );
      } 

    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={() => {}}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          height: "65%",
          transform: "translate(-50%, -50%)",
          width: "550px",
          padding: "16px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* 标题与关闭按钮 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // 居中
            alignItems: "center",
            marginBottom: 2,
            position: "relative", // 允许子元素绝对定位
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#1a237e",
              alignItems: "center",
            }}
          >
            クレジットカードを追加
          </Typography>
          <IconButton 
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 0, // 将按钮固定在右上角
          }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 错误消息显示 */}
        <Box
          sx={{
            minHeight: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 2,
          }}
        >
          {localError && (
            <Typography
              sx={{
                color: "red",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              {localError.errorMessage}
            </Typography>
          )}
        </Box>

        {/* Fincode UI 容器 */}
        <form id="fincode-ui-container-form">
          <div id={fincodeUIId}></div>
        </form>

        {/* 提交按钮 */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            marginTop: 1,
            backgroundColor: "#1a237e",
            "&:hover": { backgroundColor: "#3949ab" },
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "登録中..." : "登録する"}
        </Button>
      </Box>
    </Modal>
  );
};

export default PaymentCreditCardAdd;
