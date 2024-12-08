import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../redux/user/userSlice'; // 假设该方法已存在
import { Box, Typography, CircularProgress } from '@mui/material';
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError 类
import ErrorHandler from '../../utils/ErrorHandler';
import { GlobalPopupError } from "../../utils/GlobalPopupError"; // 引入 GlobalPopupError 类
import { setPopupError } from "../../redux/popupError/popupError"; // 引入 Popup 错误处理
import { useErrorBoundary } from "react-error-boundary"; // 错误边界


const CompletionStep = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth?.userId); // 从 store 获取 userId
  const [localError, setLocalError] = useState(null);
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    const checkUserApplicationStatus = async () => {
      try {
        // 调用 fetchUserInfo 获取最新的 userInfo
        const userInfo = await dispatch(fetchUserInfo(userId)).unwrap();

        // 检查 applicationStatus 的状态
        const applicationStatus = userInfo?.applicationStatus;

        if (applicationStatus === 'applying') {
          setStatusMessage(
            'お客様の情報をご入力いただき、誠にありがとうございます。\n\n' +
            '現在、貴社のシステム管理者による承認手続きが進行中です。\n' +
            '承認が完了次第、システムをご利用いただけるようになりますので、\n' +
            'しばらくお待ちください。'
          );
        } else if (applicationStatus === 'approved') {
          setStatusMessage(
            'お客様の情報をご入力いただき、誠にありがとうございます。\n\n' +
            '現在、システムをご利用いただける状態となっております。\n' +
            '必要な機能をご活用いただき、業務の効率化にお役立てください。'
          );
        } else if (applicationStatus === 'rejected') {
          setStatusMessage(
            'お客様の情報をご入力いただき、誠にありがとうございます。\n\n' +
            '残念ながら、貴社のシステム管理者により申請が拒否されました。\n' +
            '詳細については、貴社のシステム管理者までお問い合わせください。'
          );
        } else {
          setStatusMessage(
            'お客様の情報をご入力いただき、誠にありがとうございます。\n\n' +
            '現在の申請状況は確認中です。少々お待ちください。'
          );
        }
        return true;
      } catch (error) {
        ErrorHandler.doCatchedError(
          error,
          setLocalError,       // 本地错误处理函数
          showBoundary,        // 错误边界处理函数
          'popup',             // GlobalPopupError 处理方式
          'popup',             // 其他错误处理方式
          'SYSTEM_ERROR'       // 默认错误代码
        );
        return false;
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      checkUserApplicationStatus();
    }
  }, [dispatch, userId]);

  // 确保 useImperativeHandle 正确绑定 ref
  useImperativeHandle(ref, () => ({
    completeAction: () => {
      console.log('Completion action executed');
    },
  }));

  return (
    <Box className="completion-step" sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'left', minHeight: '50vh' }}>
      {/* 错误信息部分 */}
      <Box
        sx={{
          minHeight: 24, // 为错误信息预留固定高度
          display: 'flex', // 使用 flex 布局
          alignItems: 'center', // 垂直居中
          justifyContent: 'center', // 水平居中
          marginBottom: 2, // 与下方输入框保持距离
        }}
      >
        {localError && (
          <Typography 
            variant="body2" 
            color="error"
            sx={{
              textAlign: 'center', // 文本居中对齐
              lineHeight: '24px', // 确保文字垂直居中
            }}
          >
            {localError.errorMessage}
          </Typography>
        )}
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Typography variant="body1" className="completion-message" sx={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
          {statusMessage}
        </Typography>
      )}
    </Box>
  );
});

export default CompletionStep;
