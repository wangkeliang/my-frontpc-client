import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { addApplication } from '../../redux/application/applicationSlice';
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError 类
import ErrorHandler from '../../utils/ErrorHandler';
import { GlobalPopupError } from "../../utils/GlobalPopupError"; // 引入 GlobalPopupError 类
import { setPopupError } from "../../redux/popupError/popupError"; // 引入 Popup 错误处理
import { useErrorBoundary } from "react-error-boundary"; // 错误边界
import { setPopupInfo } from "../../redux/popupInfoSlice/popupInfoSlice"; // 导入 setPopupInfo action




const ApplicationStep = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const companyAdmins = useSelector((state) => state.company.companyAdmins || []);
  const userId = useSelector((state) => state.auth?.userId || null);
  const userInfo = useSelector((state) => state.user?.userInfo);
  const [selectedAdmin, setSelectedAdmin] = useState(null); // 选中的管理员
  const [localError, setLocalError] = useState(null);
  const { showBoundary } = useErrorBoundary();

  // 初始化加载公司管理员信息
  useEffect(() => {
    if (companyAdmins.length === 1) {
      setSelectedAdmin(companyAdmins[0]); // 如果只有一个管理员，自动选中
    }
  }, [companyAdmins]);

  // 保存申请信息
  const saveApplication = async () => {
    try {
      setLocalError(null);

      if (!selectedAdmin) {
        setLocalError(new LocalError({ errorMessage: '承認する管理者を選択してください。。' }));
        return false;
      }

      const applicationData = {
        applicationType: 'NEW_USER',
        relatedObjectId: userInfo.id || '',
        applicantId: userId || '',
        applyTime: new Date().toISOString(),
        applyMessage: `${userInfo?.firstName || ''}${userInfo?.lastName || ''}がアカウント作成を申請しました。承認してください。`,
        approverId: selectedAdmin.id,
        approveTime: null,
        approveMessage: null,
        status: 'applying',
      };

      
        await dispatch(addApplication(applicationData)).unwrap();
        dispatch(
          setPopupInfo({
            popupType: "toast", // 设置为 toast 类型
            variant: "success", // 设置为成功消息
            title: "成功",
            content: "入力した情報が保存されました。",
          })
        );
        return true;
    } catch (error) {
      console.log('application error,error=',error);
      ErrorHandler.doCatchedError(
        error,
        setLocalError,       // 本地错误处理函数
        showBoundary,        // 错误边界处理函数
        'popup',             // GlobalPopupError 处理方式
        'popup',             // 其他错误处理方式
        'SYSTEM_ERROR'       // 默认错误代码
      );
      return false;
    }
  };

  // 暴露保存方法
  useImperativeHandle(ref, () => ({
    saveApplication,
  }));

  return (
    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
  
      {/* 信息提示部分 */}
      <Typography variant="body1" gutterBottom>
        あなたのアカウントは貴社のシステム管理者の承認が必要です。承認者を選択してください。
      </Typography>
  
      {/* 系统管理员选择下拉列表 */}
      <Box sx={{ width: '50%' }}> {/* 设置下拉列表宽度为容器的一半 */}
        <Autocomplete
          options={companyAdmins}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          value={selectedAdmin}
          onChange={(event, newValue) => setSelectedAdmin(newValue)}
          disableClearable // 禁用清除按钮
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="承認する管理者を選択してください"
              required // 确保必填
            />
          )}
          sx={{
            '& .MuiInputBase-root': { fontSize: '1rem' },
            '& .MuiFormLabel-root': { fontSize: '1rem' },
          }}
        />
      </Box>
    </Box>
  );
  
});

export default ApplicationStep;
