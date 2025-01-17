import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { executePlanPurchase } from '../../redux/planPurchase/planPurchaseSlice';
import { useErrorBoundary } from 'react-error-boundary'; // 错误边界处理
import ErrorHandler from '../../utils/ErrorHandler'; // 自定义错误处理
import { LocalError } from '../../utils/LocalError'; // 本地错误处理类
import { setPopupInfo } from "../../redux/popupInfoSlice/popupInfoSlice"; // 导入 setPopupInfo action
const PlanPurchaseConfirm = forwardRef(({ purchaseData }, ref) => {
  const { startDate, isAutoRenew, planDetails } = purchaseData;
  const dispatch = useDispatch();
  const { showBoundary } = useErrorBoundary(); // 错误边界
  const { companyId, userId: purchaserId } = useSelector((state) => state.auth); // 从 Redux 中获取 companyId 和 purchaserId
  const [localError, setLocalError] = useState(null); // 本地错误状态

  // 暴露的方法
  useImperativeHandle(ref, () => ({
    confirmPurchase,
  }));

  // 调用 executePlanPurchase 的方法
  const confirmPurchase = async () => {
    try {
      setLocalError(null); // 重置本地错误状态

      // 构造请求参数
      const payload = {
        companyId,
        purchaserId,
        planCode: planDetails?.plan?.planCode,
        effectiveDateJST: startDate,
        isAutoRenew,
      };

      console.log('***Payload for API:', payload);

      const response = await dispatch(executePlanPurchase(payload)).unwrap();
      dispatch(
        setPopupInfo({
            popupType: "toast", // 设置为 toast 类型
            variant: "success", // 设置为成功消息
            title: "成功",
            content: "プラン購入手続きが正常に実行されました。引き続き支払い手続きを行ってください。",
        })
      );   
      console.log('Purchase successful:', response);
      return { success: true, response };
    } catch (error) {
      ErrorHandler.doCatchedError(
        error,
        setLocalError, // 本地错误处理
        showBoundary, // 全局错误边界处理
        'popup',
        'throw',
        'PURCHASE_ERROR' // 自定义错误代码
      );
      return { success: false, error };
    }
  };

  return (
    <Box sx={{ padding: '0px' }}>
      {/* 标题 */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: '#1a237e',
          marginBottom: '16px',
          textAlign: 'center',
        }}
      >
        プラン購入確認
      </Typography>

      {/* 提示信息 */}
      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          color: '#333',
          fontSize: '1rem',
          marginBottom: '24px',
        }}
      >
        以下の内容をご確認の上、「確認」ボタンを押してください。
      </Typography>

      {/* 错误消息显示 */}
      {localError && (
        <Typography
          variant="body2"
          color="error"
          sx={{
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          {localError.errorMessage}
        </Typography>
      )}

      {/* 信息框 */}
      <Box
        sx={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
        }}
      >
        <Typography variant="body1" sx={{ marginBottom: '16px', fontSize: '1rem', color: '#333' }}>
          <strong>プラン名:</strong> {planDetails?.plan?.planName || 'N/A'}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '16px', fontSize: '1rem', color: '#333' }}>
          <strong>金額:</strong> {planDetails?.plan?.basePrice} {planDetails?.plan?.currency || 'JPY'}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '16px', fontSize: '1rem', color: '#333' }}>
          <strong>期間:</strong> {planDetails?.plan?.subscriptionPeriod} ヶ月
        </Typography>
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{ __html: planDetails?.plan?.planDescription }}
          sx={{ marginBottom: '24px', color: '#555', lineHeight: 1.8, fontSize: '0.9rem' }}
        />
        <Typography variant="body1" sx={{ marginBottom: '16px', fontSize: '1rem', color: '#333' }}>
          <strong>有効開始日:</strong> {startDate}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>
          <strong>自動更新:</strong>{' '}
          {isAutoRenew
            ? 'プランの有効期限後、契約は自動で更新する。'
            : 'プランの有効期限後、契約は自動で更新しない。'}
        </Typography>
      </Box>
    </Box>
  );
});

export default PlanPurchaseConfirm;
