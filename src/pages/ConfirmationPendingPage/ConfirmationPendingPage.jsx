import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { resendConfirmationEmail } from '../../redux/auth/registerSlice';
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError 类
import { GlobalPopupError } from "../../utils/GlobalPopupError"; // 引入 GlobalPopupError 类
const ConfirmationPendingPage = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const { status, email } = useSelector((state) => state.register);

  // 处理确认邮件的重发请求
  const handleResendEmail = async () => {
    setMessage(''); // 清空消息
    try {
      await dispatch(resendConfirmationEmail(email)).unwrap(); // 传入 email
      setMessage('確認メールを再送信しました。メールをご確認ください。');
    } catch (error) {
      
      if (error instanceof LocalError) {
        setMessage(error.errorMessage); // 设置本地错误
      } else if (error instanceof GlobalPopupError) {
        console.log("****error instanceof GlobalPopupError", error);
        setMessage(error.errorMessage); 
      } else {
        console.log("****else", error);
        setMessage('メールの再送信に失敗しました。しばらくしてからもう一度お試しください。');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        padding: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          width: '100%',
          bgcolor: 'background.paper',
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
        }}
      >
        {/* 标题部分 - 居中对齐 */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 2,
            textAlign: 'center',
          }}
        >
          ご登録ありがとうございます！
        </Typography>

        {/* 正文部分 - 左对齐 */}
        <Box
          sx={{
            textAlign: 'left',
            mb: 4,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 2,
            }}
          >
            確認メールをお送りしておりますので、メールをご確認いただき、記載されているリンクをクリックしてアカウントを有効化してください。
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
            }}
          >
            確認メールが届かない場合は、迷惑メールフォルダをご確認いただくか、以下のボタンをクリックして再送信をリクエストしてください。
          </Typography>
        </Box>

        {/* 按钮和消息部分 - 居中对齐 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleResendEmail}
            disabled={status === 'loading'}
            sx={{
              height: 48,
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
              paddingX: 3,
              minWidth: '200px',
            }}
          >
            {status === 'loading' ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              '確認メールを再送信する'
            )}
          </Button>

          <Box
            sx={{
              minHeight: 24,
              mt: 2,
            }}
          >
            {message && (
              <Typography
                variant="body2"
                sx={{
                  color: 'success.main',
                  fontWeight: 'bold',
                }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmationPendingPage;
