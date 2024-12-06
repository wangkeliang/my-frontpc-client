import React, { useEffect,useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  Link,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError 类
import { GlobalPopupError } from "../../utils/GlobalPopupError"; // 引入 GlobalPopupError 类
import { setPopupError } from "../../redux/popupError/popupError"; // 引入 Popup 错误处理
import { useErrorBoundary } from "react-error-boundary"; // 错误边界
import { registerUser } from '../../redux/auth/registerSlice';
import { validateEmailFormat } from '../../utils/Common'; // 导入验证方法
/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {string} - 错误消息或空字符串
 */
const validateEmail = (email) => {
  if (!email) {
    return 'メールアドレスは必須です。';
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return '無効なメールアドレスです。';
  }
  return '';
};

/**
 * 获取密码强度颜色
 * @param {string} passwordStrength - 密码强度
 * @returns {string} 颜色值
 */
const getPasswordStrengthColor = (passwordStrength, theme) => {
  switch (passwordStrength) {
    case '弱い':
      return theme.palette.error.main; // 使用主题错误色
    case '中':
      return theme.palette.warning.main; // 使用主题警告色
    case '強い':
      return theme.palette.success.main; // 使用主题成功色
    default:
      return theme.palette.text.primary;
  }
};

function RegistrationFormCmp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme(); // 获取主题
  const {status } = useSelector((state) => state.register.status);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'corporate',
  });
  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    // 初始化时清空错误信息
    setLocalError(null);
  }, []);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData((prevData) => ({ ...prevData, email }));
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData((prevData) => ({ ...prevData, password }));

    if (password.length < 8) {
      setPasswordStrength('弱い');
    } else if (password.length < 12) {
      setPasswordStrength('中');
    } else {
      setPasswordStrength('強い');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setPasswordMatch(confirmPassword === formData.password);
    setFormData((prevData) => ({ ...prevData, confirmPassword }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try{
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setLocalError(new LocalError({ errorMessage: 'すべての必須項目を入力してください。' }));
        return;
      }
  
      if (!agreeTerms) {
        setLocalError(new LocalError({ errorMessage: '利用規約に同意してください。' }));
        return;
      }
      // 有効メールチェック
      const { isValid, message } = validateEmailFormat(formData.email);

      if (!isValid) {
        setLocalError(new LocalError({ errorMessage: message}));
        return;
      } 
  
      if (emailError) {
        setLocalError(new LocalError({ errorMessage: 'メールアドレスに誤りがあります、正しく入力してください。' }));
        return;
      }
      
      if (!passwordMatch) {
        setLocalError(new LocalError({ errorMessage: 'パスワードが一致しません、同じパスワードを入力してください。' }));
        return;
      }
      
      if (passwordStrength === '弱い') {
        setLocalError(new LocalError({ errorMessage: 'パスワードが弱すぎます、より強力なパスワードを設定してください。' }));
        return;
      } 

      await dispatch(registerUser(formData)).unwrap();
      navigate('/confirmation-pending');

    }catch(error){
      if (error instanceof LocalError) {
        setLocalError(error); // 设置本地错误
      } else if (error instanceof GlobalPopupError) {
        console.log("****error instanceof GlobalPopupError", error);
        dispatch(setPopupError(error));
      } else {
        console.log("****else", error);
        dispatch(setPopupError(new GlobalPopupError({ error, errorMessage: "未知エラーが発生しました。" })));
      }
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 480,
        mx: 'auto',
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        アカウントの新規作成（無料）
      </Typography>

      <Box sx={{ minHeight: '24px', mb: 1, mt: 2 }}>
        {localError && (
          <Typography color="error" sx={{ fontWeight: 'bold', fontSize: '14px', lineHeight: 1.5 }}>
            {localError.errorMessage}
          </Typography>
        )}
      </Box>

      <RadioGroup
        row
        value={formData.accountType}
        onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
        sx={{ mb: 1 }}
      >
        <FormControlLabel value="corporate" control={<Radio />} label="法人" />
        <FormControlLabel value="individual" control={<Radio />} label="個人事業主" />
      </RadioGroup>

      <TextField
        fullWidth
        id="email"
        label="メールアドレス"
        type="email"
        value={formData.email}
        onChange={handleEmailChange}
        error={!!emailError}
        helperText={emailError || ' '}
        sx={{ mb: 1, '& .MuiInputBase-root': { height: 48 } }}
        FormHelperTextProps={{
          sx: { minHeight: 20, fontSize: '14px', lineHeight: 1.5 },
        }}
      />

      <TextField
        fullWidth
        id="password"
        label="パスワード"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handlePasswordChange}
        helperText={passwordStrength || ' '}
        sx={{ mb: 1, '& .MuiInputBase-root': { height: 48 } }}
        FormHelperTextProps={{
          sx: { minHeight: 20, fontSize: '14px', color: getPasswordStrengthColor(passwordStrength, theme) },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        id="confirmPassword"
        label="もう一度入力してください"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleConfirmPasswordChange}
        error={!passwordMatch}
        helperText={(!passwordMatch && 'パスワードが一致しません') || ' '}
        sx={{ mb: 1, '& .MuiInputBase-root': { height: 48 } }}
        FormHelperTextProps={{
          sx: { minHeight: 20, fontSize: '14px', lineHeight: 1.5 },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />}
          label="以下の規約・ポリシーを確認の上、同意します。"
        />
        <Typography variant="body2" sx={{ mt: 1 }}>
          <Link href="#">利用規約</Link>・<Link href="#">プライバシーポリシー</Link>・
          <Link href="#">反社条項付き誓约书はこちら</Link>
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        sx={{ height: 48, fontSize: '16px' }}
        disabled={!agreeTerms || status === 'loading'}
      >
        {status === 'loading' ? '登録中...' : 'サインアップ'}
      </Button>
    </Box>
  );
}

export default RegistrationFormCmp;
