import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlanPurchase, clearPlanPurchase } from '../../redux/planPurchase/planPurchaseSlice';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError 类
import { useErrorBoundary } from "react-error-boundary"; // 错误边界
import ErrorHandler from '../../utils/ErrorHandler'; // 自定义错误处理
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
dayjs.extend(utc);
dayjs.extend(timezone);

const PlanPurchaseInput = forwardRef(({ planCode, companyId }, ref) => {
  const dispatch = useDispatch();
  const { showBoundary } = useErrorBoundary();
  const { planDetails, planPurchaseLoading } = useSelector((state) => state.planPurchase);
  const [localError, setLocalError] = useState(null);
  const [effectiveImmediately, setEffectiveImmediately] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [isAutoRenew, setIsAutoRenew] = useState(false);

  // 使用 useImperativeHandle 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    saveChanges,
  }));

  // 初始化加载数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalError(null); // 清除本地错误
        await dispatch(fetchPlanPurchase({ planCode, companyId })).unwrap();
      } catch (error) {
        // 错误处理
        ErrorHandler.doCatchedError(
          error,
          setLocalError, // 本地错误
          showBoundary, // 全局错误边界
          'popup', // 提示方式
          'throw',
          'SYSTEM_ERROR' // 默认错误类型
        );
      }
    };

    if (planCode && companyId) {
      fetchData();
    }

    return () => {
      dispatch(clearPlanPurchase());
    };
  }, [dispatch, planCode, companyId]);

  useEffect(() => {
    console.log('***planDetails=', JSON.stringify(planDetails));
    if (planDetails?.startDate) {
      // 转换 UTC 时间为 JST 日期格式
      const jstDate = dayjs.utc(planDetails.startDate).tz('Asia/Tokyo').format('YYYY-MM-DD');
      setStartDate(jstDate);
    } else {
      setStartDate(dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD')); // 默认当前日期
    }
  }, [planDetails]);

  // 保存更改并验证日期
  const saveChanges = async () => {
    try {
      setLocalError(null); // 重置错误状态
  
      // 检查日期是否小于当天
      const today = dayjs().tz('Asia/Tokyo').startOf('day');
      const selectedDate = dayjs(startDate).tz('Asia/Tokyo').startOf('day');
      if (selectedDate.isBefore(today)) {
        setLocalError(new LocalError({ errorMessage: '有効開始日は本日以降の日付を設定してください。' }));
        return {
          checkError: true,
          input: {
            effectiveImmediately,
            startDate: effectiveImmediately ? dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD') : startDate,
            isAutoRenew,
            planDetails,
          },
        };
      }
  
      // 构造返回值
      return {
        checkError: false,
        input: {
          effectiveImmediately,
          startDate: effectiveImmediately ? dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD') : startDate,
          isAutoRenew,
          planDetails,
        },
      };
    } catch (error) {
      ErrorHandler.doCatchedError(
        error,
        setLocalError,       // 本地错误处理函数
        showBoundary,        // 错误边界处理函数
        'popup',             // 提示方式
        'popup',             // 错误处理方式
        'SYSTEM_ERROR'       // 默认错误代码
      );
      return {
        checkError: true,
        input: {
          effectiveImmediately,
          startDate: effectiveImmediately ? dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD') : startDate,
          isAutoRenew,
          planDetails,
        },
      };
    }
  };
  

  if (planPurchaseLoading) {
    return (
      <Box sx={{ textAlign: 'center', padding: '20px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!planDetails) {
    return (
      <Box sx={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="body1" sx={{ color: '#f44336' }}>
          プランデータが取得できませんでした。
        </Typography>
      </Box>
    );
  }

  const { plan, currentActivePlanExistFlag, currentActivePlanEnddate } = planDetails;

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
        プラン購入
      </Typography>

      {/* エラーメッセージ表示 */}
      <Box
        sx={{
          minHeight: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 2,
        }}
      >
        {localError && (
          <Typography
            variant="body2"
            color="error"
            sx={{
              textAlign: 'center',
              lineHeight: '24px',
            }}
          >
            {localError.errorMessage}
          </Typography>
        )}
      </Box>

      {/* Plan 信息 */}
      <Box
        sx={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          backgroundColor: '#f0f0f0',
        }}
      >
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>プラン:</strong> {plan.planName}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>金額:</strong> {plan.basePrice} {plan.currency || 'JPY'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>期間:</strong> {plan.subscriptionPeriod} ヶ月
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          dangerouslySetInnerHTML={{ __html: plan.planDescription }}
          sx={{
            marginTop: '8px',
            color: '#616161',
          }}
        />
      </Box>

       {/* 即日有効化 */}
       <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 'bold', color: '#1a237e' }}
          >
            1. プランを即日有効化しますか？
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={effectiveImmediately}
                onChange={(e) => setEffectiveImmediately(e.target.checked)}
                color="primary"
              />
            }
            label={effectiveImmediately ? 'はい' : 'いいえ'}
            labelPlacement="start"
          />
        </Box>

        {currentActivePlanExistFlag && (
          <Typography
            variant="body2"
            sx={{
              color: '#f44336',
              marginTop: '8px',
            }}
          >
            ※現在利用中のプランの終了日は「 {dayjs
              .utc(currentActivePlanEnddate)
              .tz('Asia/Tokyo')
              .format('YYYY/MM/DD')} 」です。
            <br />
            有効開始日は終了日の翌日をお勧めします。
          </Typography>
        )}

        {!effectiveImmediately && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="有効開始日を入力してください"
                value={startDate ? dayjs(startDate) : null}
                onChange={(newValue) => {
                  setStartDate(newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={Boolean(localError)}
                    helperText={localError?.errorMessage || ''}
                    sx={{
                      '& .MuiInputBase-root': { height: 40, fontSize: '14px' },
                      '& .MuiInputLabel-root': { fontSize: '14px' },
                      mt: 1,
                    }}
                  />
                )}
                format="YYYY/MM/DD" // 设置日期格式
              />
            </Box>
          </LocalizationProvider>
        )}
      </Box>

      {/* 自動更新 */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              color: planDetails?.plan?.isReorderable ? '#1a237e' : '#9e9e9e',
            }}
          >
            2. プランの有効期限後、契約は自動で更新しますか？
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isAutoRenew}
                onChange={(e) => setIsAutoRenew(e.target.checked)}
                color="primary"
                disabled={!planDetails?.plan?.isReorderable}
              />
            }
            label={isAutoRenew ? 'はい' : 'いいえ'}
            labelPlacement="start"
          />
        </Box>
      </Box>
    </Box>
  );
});

export default PlanPurchaseInput;