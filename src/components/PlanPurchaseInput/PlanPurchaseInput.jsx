import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalError } from '../../utils/LocalError';

dayjs.extend(utc);
dayjs.extend(timezone);

const PlanPurchaseInput = forwardRef(
  ({ planDetails, effectiveImmediately, startDate, isAutoRenew, onSave }, ref) => {
    const [localError, setLocalError] = useState(null);
    const [localEffectiveImmediately, setLocalEffectiveImmediately] = useState(effectiveImmediately);
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localIsAutoRenew, setLocalIsAutoRenew] = useState(isAutoRenew);

    // 使用 useImperativeHandle 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      saveChanges,
    }));

    // 初始化传递的参数
    useEffect(() => {
      setLocalEffectiveImmediately(effectiveImmediately);
      setLocalStartDate(startDate);
      setLocalIsAutoRenew(isAutoRenew);
    }, [effectiveImmediately, startDate, isAutoRenew]);

    // 保存更改并验证日期
    const saveChanges = async () => {
      try {
        setLocalError(null); // 重置错误状态

        const today = dayjs().tz('Asia/Tokyo').startOf('day');
        const selectedDate = dayjs(localStartDate).tz('Asia/Tokyo').startOf('day');
        if (!localEffectiveImmediately && selectedDate.isBefore(today)) {
          setLocalError(
            new LocalError({
              errorMessage: '有効開始日は本日以降の日付を設定してください。',
            })
          );
          return {
            checkError: true,
            input: { effectiveImmediately: localEffectiveImmediately, startDate: localStartDate, isAutoRenew: localIsAutoRenew, planDetails },
          };
        }

        // 保存用户输入的值到父组件
        const input = {
          effectiveImmediately: localEffectiveImmediately,
          startDate: localEffectiveImmediately
            ? dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD')
            : localStartDate,
          isAutoRenew: localIsAutoRenew,
          planDetails,
        };
        onSave(input);

        return {
          checkError: false,
          input,
        };
      } catch (error) {
        setLocalError(new LocalError({ errorMessage: '保存中にエラーが発生しました。' }));
        return {
          checkError: true,
        };
      }
    };

    const { plan, currentActivePlanExistFlag, currentActivePlanEnddate } = planDetails || {};

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
              sx={{ textAlign: 'center', lineHeight: '24px' }}
            >
              {localError.errorMessage}
            </Typography>
          )}
        </Box>

        {/* Plan 信息 */}
        {plan && (
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
              sx={{ marginTop: '8px', color: '#616161' }}
            />
          </Box>
        )}

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
                  checked={localEffectiveImmediately}
                  onChange={(e) => setLocalEffectiveImmediately(e.target.checked)}
                  color="primary"
                />
              }
              label={localEffectiveImmediately ? 'はい' : 'いいえ'}
              labelPlacement="start"
            />
          </Box>

          {currentActivePlanExistFlag && (
            <Typography
              variant="body2"
              sx={{ color: '#f44336', marginTop: '8px' }}
            >
              ※現在利用中のプランの終了日は「 {dayjs
                .utc(currentActivePlanEnddate)
                .tz('Asia/Tokyo')
                .format('YYYY/MM/DD')} 」です。
              <br />
              有効開始日は終了日の翌日をお勧めします。
            </Typography>
          )}

          {!localEffectiveImmediately && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ mt: 2 }}>
                <DatePicker
                  label="有効開始日を入力してください"
                  value={dayjs(localStartDate)}
                  onChange={(newValue) => {
                    setLocalStartDate(newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
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
                  format="YYYY/MM/DD"
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
                  checked={localIsAutoRenew}
                  onChange={(e) => setLocalIsAutoRenew(e.target.checked)}
                  color="primary"
                  disabled={!planDetails?.plan?.isReorderable}
                />
              }
              label={localIsAutoRenew ? 'はい' : 'いいえ'}
              labelPlacement="start"
            />
          </Box>
        </Box>
      </Box>
    );
  }
);

export default PlanPurchaseInput;
