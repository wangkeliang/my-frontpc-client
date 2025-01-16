import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const PlanPurchaseConfirm = ({ purchaseData, onNext, onBack }) => {
  const { effectiveImmediately, startDate, isAutoRenew, planDetails } = purchaseData;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
        購入確認
      </Typography>
      <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', p: 3, mb: 3 }}>
        <Typography variant="body1">
          <strong>プラン:</strong> {planDetails?.planName || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>金額:</strong> {planDetails?.basePrice} {planDetails?.currency}
        </Typography>
        <Typography variant="body1">
          <strong>期間:</strong> {planDetails?.subscriptionPeriod} ヶ月
        </Typography>
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{ __html: planDetails?.planDescription }}
        />
        <Typography variant="body1">
          <strong>即日有効化:</strong> {effectiveImmediately ? 'はい' : 'いいえ'}
        </Typography>
        {!effectiveImmediately && (
          <Typography variant="body1">
            <strong>有効開始日:</strong> {startDate}
          </Typography>
        )}
        <Typography variant="body1">
          <strong>自動更新:</strong> {isAutoRenew ? 'はい' : 'いいえ'}
        </Typography>
      </Box>

    </Box>
  );
};

export default PlanPurchaseConfirm;
