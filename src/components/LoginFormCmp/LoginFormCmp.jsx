import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/auth/authSlice";
import { validateEmailFormat } from "../../utils/Common"; // 引入邮箱验证方法
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError 类
import { GlobalPopupError } from "../../utils/GlobalPopupError"; // 引入 GlobalPopupError 类
import { setPopupError } from "../../redux/popupError/popupError"; // 引入 Popup 错误处理
import { useErrorBoundary } from "react-error-boundary"; // 错误边界
// import { registerUser } from '../../redux/auth/registerSlice';
// MUI 组件
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function LoginFormCmp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { loading } = useSelector((state) => state.auth); // 获取加载状态
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    // 初始化登录表单
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    const savedRememberMe = !!(savedEmail && savedPassword);

    if (savedRememberMe) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(savedRememberMe);
    }

    // 清空 Redux 状态
    dispatch({ type: "root/clearAllStates" });
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null); // 清空本地错误

    // 验证用户输入
    if (!email && !password) {
      setLocalError(new LocalError({ errorMessage: 'メールアドレスとパスワードは必須です。' }));
      return;
    }
    if (!email) {
      setLocalError(new LocalError({ errorMessage: 'メールアドレスは必須です。' }));
      return;
    }
    if (!password) {
      setLocalError(new LocalError({ errorMessage: 'パスワードは必須です。' }));
      return;

    }

    const { isValid, message } = validateEmailFormat(email);
    if (!isValid) {
      setLocalError(new LocalError({ errorMessage: message }));
      return;
    }

    try {
      // 处理本地存储
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      console.log("**before dispatch");
      await dispatch(loginUser({ email, password })).unwrap();
      console.log("**after dispatch");

    } catch (error) {
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

  const handleSignUpClick = () => {
    navigate("/register");
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        ログイン
      </Typography>

      <form onSubmit={handleLogin}>
      {/* 错误信息占位 */}
      <Box
          sx={{
            minHeight: 24, // 固定高度，避免内容晃动
            mb: 1,
            
          }}
        >
          {localError && (
            <Typography variant="body2" color="error" >
              {localError.errorMessage}
            </Typography>
          )}
      </Box>

        {/* Email 输入框 */}
        <FormControl fullWidth margin="normal" variant="outlined" sx={{ mt: 2 }}>
          <InputLabel htmlFor="email">メールアドレス</InputLabel>
          <OutlinedInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="メールアドレス"
            sx={{ height: 48 }} // 设置输入框高度
          />
        </FormControl>

        {/* Password 输入框，带显示/隐藏功能 */}
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel htmlFor="password">パスワード</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? "text" : "password"} // 根据状态动态切换类型
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                  onClick={() => setShowPassword(!showPassword)} // 修正状态切换
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />} {/* 修正图标顺序 */}
                </IconButton>
              </InputAdornment>
            }
            label="パスワード"
            sx={{ height: 48 }} // 设置输入框高度
          />
        </FormControl>

        {/* 记住我 复选框 */}
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
            />
          }
          label="ログイン情報を保存する"
        />

        {/* 登录按钮 */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ 
            mt: 2, 
            mb: 2,
            height: 48, 
            fontSize: "1rem", // 调整按钮文字大小
          }}
          
          disabled={loading}
        >
          {loading ? "ログイン中..." : "ログイン"}
        </Button>

        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Link href="/forgot-password" variant="body2">
            パスワードをお忘れですか？
          </Link>
          <Link
            onClick={handleSignUpClick}
            variant="body2"
            sx={{ cursor: "pointer" }}
          >
            サインアップ
          </Link>
        </Box>
      </form>
    </Box>
  );
};


export default LoginFormCmp;
