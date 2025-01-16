import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import PlanHistoryDetail from '../PlanHistoryDetail/PlanHistoryDetail';
import { fetchActivePlan } from '../../redux/planHistory/planHistorySlice';
import ErrorHandler from '../../utils/ErrorHandler';
import { useErrorBoundary } from "react-error-boundary"; // 错误边界
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError 类
const PlanCurrent = () => {
  const dispatch = useDispatch();
  const [localError, setLocalError] = useState(null);
  // Redux 状态
  const {activePlan,isFetchingActiveLoading} = useSelector((state) => state.planHistory);
  const { companyId } = useSelector((state) => state.auth);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        if (companyId) {
          await dispatch(fetchActivePlan(companyId)).unwrap();
        }
      } catch (error) {
        console.log('***catchcatchcatchcatchcatchcatch=', error); // 捕获异步函数中的错误
        ErrorHandler.doCatchedError(
          error,
          setLocalError,
          showBoundary,
          'popup',
          'throw',
          'SYSTEM_ERROR'
        );
      }
    };
    fetchPlanData(); // 调用内部异步函数
  }, [dispatch, companyId, showBoundary]);
  

  // 优先检查加载状态
  if (isFetchingActiveLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }


if (!localError){
    if (!activePlan || !activePlan.id) {
        return (
        <Box 
            display="flex" 
            justifyContent="flex-start" 
            alignItems="flex-start" 
            height="100%" 
            sx={{ padding: '16px' }} // 增加适当的内边距
        >
            <Typography 
            variant="h6" 
            sx={{
                color: '#D32F2F', // 红色字体
                fontFamily: '"Roboto", "Noto Sans JP", "Helvetica", "Arial", sans-serif', // 专业日语字体
                fontWeight: 'bold', // 加粗以显得更专业
            }}
            >
            現在有効なプランがございません。
            </Typography>
        </Box>
        );
    }
    
}
    

  // 打印 activePlan.id
//   console.log('Active Plan ID:', activePlan.id);

  return (
    <Box>
         {/* 错误信息 */}
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

      {/* 显示 activePlan.id */}
      {/* <Typography variant="h6">当前计划 ID: {activePlan?.id}</Typography> */}
      
      {/* PlanHistoryDetail 组件 */}
    {/* 只有没有 localError 时才显示子组件 */}
    {!localError && activePlan?.id && (
      <PlanHistoryDetail planHistoryId={activePlan.id} />
    )}
    </Box>
  );
};

export default PlanCurrent;
