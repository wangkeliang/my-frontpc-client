import React, { useState, useImperativeHandle, forwardRef } from "react";
import InputMask from "react-input-mask";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Button,
} from "@mui/material";

import Grid from '@mui/material/Grid2';
import { useDispatch, useSelector } from "react-redux";
import {
  addCompany,
  updateCompany,
  fetchCompanyByDomain,
} from "../../redux/company/companySlice";
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError 类
import { GlobalPopupError } from "../../utils/GlobalPopupError"; // 引入 GlobalPopupError 类
import ErrorMap from '../../utils/ErrorMap';
import { setPopupError } from "../../redux/popupError/popupError"; // 引入 Popup 错误处理
import { useErrorBoundary } from "react-error-boundary"; // 错误边界
import { setPopupInfo } from "../../redux/popupInfoSlice/popupInfoSlice"; // 导入 setPopupInfo action
import ErrorHandler from '../../utils/ErrorHandler';

const CompanyInfoStep = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { showBoundary } = useErrorBoundary();
  const companyInfo = useSelector((state) => state.company?.companyInfo || null);
  const domain = useSelector((state) => state.auth?.domain || "");
  const [errors, setErrors] = useState({}); // 错误状态 
  const [localError, setLocalError] = useState(null);
  const [fields, setFields] = useState({
    id: "",
    companyName: "",
    postalCode: "",
    address: "",
    websiteUrl: "",
    phone: "",
    salesEmail: "",
    hrEmail: "",
  });

  React.useEffect(() => {
    if (companyInfo) {
      setFields({
        id: companyInfo.id || "",
        companyName: companyInfo.companyName || "",
        postalCode: companyInfo.postalCode || "",
        address: companyInfo.address || "",
        websiteUrl: companyInfo.websiteUrl || "",
        phone: companyInfo.phone || "",
        salesEmail: companyInfo.salesEmail || "",
        hrEmail: companyInfo.hrEmail || "",
      });
    }
  }, [companyInfo]);

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const validateFields = () => {
    const errors = {};
    if (
      !fields.hrEmail.trim() ||
      fields.hrEmail.length > 40 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.hrEmail)
    ) {
      errors.hrEmail = true;
      setLocalError(new LocalError({ errorMessage: '有効な採用共通メールを入力してください。' }));
    }

    if (
      !fields.salesEmail.trim() ||
      fields.salesEmail.length > 40 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.salesEmail)
    ) {
      errors.salesEmail = true;
      setLocalError(new LocalError({ errorMessage: '有効な営業共通メールを入力してください。' }));
    }

    if (!fields.phone) {
      errors.phone = true;
      setLocalError(new LocalError({ errorMessage: '必須項目が未入力です、すべての必須項目を入力してください。' }));
    } else if (!/^\d{2,3}-\d{4}-\d{4}$/.test(fields.phone)) {
      errors.phone = true;
      setLocalError(new LocalError({ errorMessage: '電話番号の形式が正しくありません (例: 090-0000-0000)。' }));
    }

    if (fields.websiteUrl && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/.test(fields.websiteUrl)) {
      errors.websiteUrl = true;
      setLocalError(new LocalError({ errorMessage: '有効なホームページを入力してください。' }));
    }

    if (!fields.address.trim() || fields.address.length > 40) {
      errors.address = true;
      setLocalError(new LocalError({ errorMessage: '必須項目が未入力です、すべての必須項目を入力してください。' }));
    }

    if (!fields.companyName.trim() || fields.companyName.length > 40) {
      errors.companyName = true;
      setLocalError(new LocalError({ errorMessage: '必須項目が未入力です、すべての必須項目を入力してください。' }));
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePostalCodeChange = (e) => {
    const code = e.target.value;
    handleFieldChange("postalCode", code);

    if (code.length === 8 && /^\d{3}-\d{4}$/.test(code)) {
      fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code.replace("-", "")}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.results) {
            const result = data.results[0];
            const fullAddress = `${result.address1} ${result.address2} ${result.address3}`;
            handleFieldChange("address", fullAddress);
          } else {
            handleFieldChange("address", "");
          }
        })
        .catch(() => {
          handleFieldChange("address", "");
        });
    } else {
      handleFieldChange("address", "");
    }
  };

  const saveChanges = async () => {
    try{

      setLocalError(null);
      if (!validateFields()) return false;
      const updatedCompanyInfo = await dispatch(fetchCompanyByDomain(domain)).unwrap();

      const hasChanges = Object.keys(fields).some(
        (key) => fields[key] !== (updatedCompanyInfo ? updatedCompanyInfo[key] || "" : "")
      );

      if (hasChanges) {
        if (updatedCompanyInfo) {
          await dispatch(updateCompany(fields)).unwrap();
        } else {
          await dispatch(addCompany(fields)).unwrap();
        }

        dispatch(
          setPopupInfo({
            popupType: "toast", // 设置为 toast 类型
            variant: "success", // 设置为成功消息
            title: "成功",
            content: "入力した情報が保存されました。",
          })
        );    
        return true;
      }

    }catch(error){
      ErrorHandler.doCatchedError(
        error,
        setLocalError,       // 本地错误处理函数
        showBoundary,   // 错误边界处理函数
        'popup',             // GlobalPopupError 处理方式
        'popup',             // 其他错误处理方式
        'SYSTEM_ERROR'       // 默认错误代码
      );
      return false;
    }   
  };

  useImperativeHandle(ref, () => ({
    saveChanges,
  }));

  return (
    <Box sx={{ padding: 0 }}>
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

    {/* 表单部分 */}
    <Grid container spacing={3}>
      {/* 公司名 */}
      <Grid size={12}>
        <TextField
          label="会社名"
          variant="outlined"
          fullWidth
          required
          size="small"
          value={fields.companyName}
          onChange={(e) => handleFieldChange("companyName", e.target.value)}
          error={errors.companyName}
          slotProps={{
            inputLabel: {
              sx: {
                "& .MuiInputLabel-asterisk": {
                  color: "red", // 设置星号的颜色
                },
              },
            },
          }}
        />
      </Grid>

      {/* 邮编和地址 */}
      <Grid size={12}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ flexBasis: "15%", flexShrink: 0 }}>
            <InputMask
              mask="999-9999"
              value={fields.postalCode}
              onChange={handlePostalCodeChange}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label="郵便番号"
                  variant="outlined"
                  size="small"
                  placeholder="郵便番号"
                  error={errors.postalCode}
                  fullWidth
                />
              )}
            </InputMask>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              label="住所"
              variant="outlined"
              fullWidth
              required
              size="small"
              value={fields.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              error={errors.address}
              slotProps={{
                inputLabel: {
                  sx: {
                    "& .MuiInputLabel-asterisk": {
                      color: "red", // 设置星号的颜色
                    },
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Grid>

      {/* 电话和主页 */}
      <Grid size={6}>
        <TextField
          label="ホームページ"
          variant="outlined"
          fullWidth
          size="small"
          value={fields.websiteUrl}
          onChange={(e) => handleFieldChange("websiteUrl", e.target.value)}
          error={errors.websiteUrl}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="電話番号"
          variant="outlined"
          fullWidth
          required
          size="small"
          value={fields.phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
          error={errors.phone}
          slotProps={{
            inputLabel: {
              sx: {
                "& .MuiInputLabel-asterisk": {
                  color: "red", // 设置星号的颜色
                },
              },
            },
          }}
        />
      </Grid>

      {/* 销售和招聘邮箱 */}
      <Grid size={6}>
        <TextField
          label="営業共通メール"
          variant="outlined"
          fullWidth
          required
          size="small"
          value={fields.salesEmail}
          onChange={(e) => handleFieldChange("salesEmail", e.target.value)}
          error={errors.salesEmail}
          slotProps={{
            inputLabel: {
              sx: {
                "& .MuiInputLabel-asterisk": {
                  color: "red", // 设置星号的颜色
                },
              },
            },
          }}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="採用共通メール"
          variant="outlined"
          fullWidth
          required
          size="small"
          value={fields.hrEmail}
          onChange={(e) => handleFieldChange("hrEmail", e.target.value)}
          error={errors.hrEmail}
          slotProps={{
            inputLabel: {
              sx: {
                "& .MuiInputLabel-asterisk": {
                  color: "red", // 设置星号的颜色
                },
              },
            },
          }}
        />
      </Grid>
    </Grid>
  </Box>
);
  
  
});

export default CompanyInfoStep;
