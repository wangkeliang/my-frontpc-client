import React from 'react';
import { Box, Button, Typography } from '@mui/material';

function PromoPanelCmp() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2, // 子项之间的间距
        px: 2, // 左右内边距
      }}
    >
      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
        あなたのビジネスにさらなる成長を
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
        セールス、サービス、マーケティング、ITなど
        <br />
        会社のあらゆる業務の効率化を支援
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary">
          無料トライアル
        </Button>
        <Button variant="outlined" color="primary">
          デモを見せる
        </Button>
      </Box>
    </Box>
  );
}

export default PromoPanelCmp;
