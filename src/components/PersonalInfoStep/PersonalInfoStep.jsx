import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styles from './PersonalInfoStep.module.css';
import SearchSelectComponent from '../SearchSelectComponent/SearchSelectComponent';
import { updateUser, setRoleApplications } from '../../redux/user/userSlice';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError 类
import { GlobalPopupError } from "../../utils/GlobalPopupError"; // 引入 GlobalPopupError 类
import { setPopupError } from "../../redux/popupError/popupError"; // 引入 Popup 错误处理
import { useErrorBoundary } from "react-error-boundary"; // 错误边界
import { setPopupInfo } from "../../redux/popupInfoSlice/popupInfoSlice"; // 导入 setPopupInfo action
import ErrorMap from '../../utils/ErrorMap';
import ErrorHandler from '../../utils/ErrorHandler';

const PersonalInfoStep = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { showBoundary } = useErrorBoundary();

  // --- 状态定义 ---
  const [fields, setFields] = useState({
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    email: '',
    phoneNumber: '',
    department: '',
    managerId: '',
  });

  const [selectedRoles, setSelectedRoles] = useState([]); // 选中的角色
  const [availableRoles, setAvailableRoles] = useState([]); // 可用角色列表
  const [errors, setErrors] = useState({}); // 错误状态
  const [localError, setLocalError] = useState(null);
  // const [selectManagerId, setSelectManagerId] = useState('');
  

  // --- Redux 数据获取 ---
  const userInfo = useSelector((state) => state.user?.userInfo || null);
  const managerInfo = useSelector((state) => state.user?.managerInfo || null);
  const roleApplications = useSelector((state) => state.user?.roleApplications || []);
  const companyMembers = useSelector((state) => state.company?.companyMembers || []);
  const roleMaster = useSelector((state) => state.master?.roleMaster || []);
  const companyInfo = useSelector((state) => state.company?.companyInfo || null);
  const reduxError = useSelector((state) => state.user?.error); // Redux 错误信息

  // --- 初始化数据 ---
  useEffect(() => {
    try{
      console.log('***userInfo=',userInfo);
      console.log('***managerInfo=',managerInfo);
      console.log('***roleApplications=',roleApplications);
      console.log('***companyMembers=',companyMembers);
      console.log('***roleMaster=',roleMaster);
      console.log('***companyInfo=',companyInfo);
      // 初始化字段
      if (userInfo) {
        setFields({
          lastName: userInfo.lastName || '',
          firstName: userInfo.firstName || '',
          lastNameKana: userInfo.lastNameKana || '',
          firstNameKana: userInfo.firstNameKana || '',
          email: userInfo.email || '',
          phoneNumber: userInfo.phoneNumber || '',
          department: userInfo.department || '',
          managerId: userInfo.managerId || '',
        });
        // setSelectManagerId(userInfo?.managerId || ''); // 初始化 selectManagerId
      }

      // 初始化选中角色和可用角色
      if (roleApplications && roleMaster) {
        const mappedRoles = roleApplications
          .map((roleApplication) => {
            const matchedRole = roleMaster.find((role) => role.roleCode === roleApplication.roleCode);
            return matchedRole
              ? {
                  value: roleApplication.roleCode,
                  label: matchedRole.roleName,
                }
              : null;
          })
          .filter((role) => role !== null);

        // 如果公司信息为空，确保系统管理员角色存在
        if (!companyInfo) {
          const adminRole = roleMaster.find((role) => role.roleCode === 'r000000');
          if (adminRole && !mappedRoles.some((role) => role.value === 'r000000')) {
            mappedRoles.unshift({
              value: adminRole.roleCode,
              label: adminRole.roleName,
            });
          }
        }

        setSelectedRoles(mappedRoles);

        // 初始化可用角色列表
        const available = roleMaster.map((role) => ({
          value: role.roleCode,
          label: role.roleName,
        }));
        setAvailableRoles(
          available.filter((role) => !mappedRoles.some((selected) => selected.value === role.value))
        );
        console.log('**selectedRoles=',selectedRoles);
        console.log('**availableRoles=',availableRoles);
      }
    }catch(error){
      ErrorHandler.doCatchedError(
        error,
        setLocalError,       // 本地错误处理函数
        showBoundary,   // 错误边界处理函数
        'popup',             // GlobalPopupError 处理方式
        'throw',             // 其他错误处理方式
        'SYSTEM_ERROR'       // 默认错误代码
      );

    }
    
  }, [userInfo, managerInfo, roleMaster, roleApplications]);

  // --- 字段修改处理 ---
  const handleFieldChange = (field, value) => {
    setFields((prevFields) => ({ ...prevFields, [field]: value }));
  };

  const handleSelect = (selected) => {
    console.log('**handleSelect Selected item:', selected);
    // setSelectManagerId(selected.id); // 更新选中的 Manager ID
    setFields((prevFields) => ({
      ...prevFields,
      managerId: selected.id,
    }));
  };
  const handleClearManager = () => {    
    setFields((prevFields) => ({
      ...prevFields,
      managerId: null,
    }));
  };

  // --- 角色选择处理 ---
  const handleRoleChange = (event, value) => {
    // 如果公司信息为空，确保系统管理员角色始终在选中列表中
    const adminRole = roleMaster.find((role) => role.roleCode === 'r000000');
    if (!companyInfo && adminRole && !value.some((role) => role.value === 'r000000')) {
      value.unshift({
        value: adminRole.roleCode,
        label: adminRole.roleName,
      });
    }
    setSelectedRoles(value);

    // 更新可用角色列表
    setAvailableRoles(
      roleMaster
        .map((role) => ({
          value: role.roleCode,
          label: role.roleName,
        }))
        .filter((role) => !value.some((selected) => selected.value === role.value))
    );
  };

  // --- 格式化数据 ---
  const tableDisplayFormat = {
    お名前: ['firstName', 'lastName'],
    メール: ['email'],
    部署: ['department'],
  };


  // --- 校验逻辑 ---
  const validateFields = () => {
    const errors = {};
    let errorMessage = '';

    // 至少选择一个角色
    if (selectedRoles.length === 0) {
      errors.selectedRoles = true;
      setLocalError(new LocalError({ errorMessage: '少なくとも1つのロールを選択してください。' }));
    }

    
    if (!fields.phoneNumber) {
      errors.phoneNumber = true;
      setLocalError(new LocalError({ errorMessage: '必須項目が未入力です、すべての必須項目を入力してください。' }));
    } else if (!/^\d{2,3}-\d{4}-\d{4}$/.test(fields.phoneNumber)) {
      errors.phoneNumber = true;
      setLocalError(new LocalError({ errorMessage: '電話番号の形式が正しくありません (例: 090-0000-0000)。' }));
    }

    // 如果输入了名片假名，则检查是否为片假名
    if (fields.firstNameKana && !/^[\u30A0-\u30FF]+$/.test(fields.firstNameKana)) {
      errors.firstNameKana = true;
      setLocalError(new LocalError({ errorMessage: '名カナは片仮名で入力してください。' }));
    }

    // 如果输入了姓片假名，则检查是否为片假名
    if (fields.lastNameKana && !/^[\u30A0-\u30FF]+$/.test(fields.lastNameKana)) {
      errors.lastNameKana = true;
      setLocalError(new LocalError({ errorMessage: '姓カナは片仮名で入力してください。' }));
    }

    if (!fields.firstName) {
      errors.firstName = true;
      setLocalError(new LocalError({ errorMessage: '必須項目が未入力です、すべての必須項目を入力してください。' }));
    }

    // 必填校验
    if (!fields.lastName) {
      errors.lastName = true;
      setLocalError(new LocalError({ errorMessage: '必須項目が未入力です、すべての必須項目を入力してください。' }));
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- 保存方法 ---
  const saveChanges = async () => {
    try{
      setLocalError(null);

      if (!validateFields()) {
        return false;
      }
  
      const updatedFields = {
        id: userInfo.id,
        email: fields.email,
        firstName: fields.firstName,
        lastName: fields.lastName,
        firstNameKana: fields.firstNameKana,
        lastNameKana: fields.lastNameKana,
        phoneNumber: fields.phoneNumber,
        department: fields.department,
        managerId: fields.managerId, 
      };
  
      const hasFieldChanges = Object.keys(updatedFields).some((key) => {
        const userField = userInfo[key] || '';
        const updatedField = updatedFields[key] || '';
        console.log('***key=',key);
        console.log('***userField=',userField);
        console.log('***updatedField=',updatedField);
        return userField !== updatedField;
      });
      console.log('***hasFieldChanges=',hasFieldChanges);
  
  
      // --- 检查角色是否有变化 ---
      const formattedRolesApplications = selectedRoles.map((role) => ({
        userId: userInfo.id,
        roleCode: role.value,
      }));
  
      const formattedExistingRoles = roleApplications.map((role) => ({
        userId: userInfo.id,
        roleCode: role.roleCode,
      }));
  
      const hasRoleChanges =
        JSON.stringify(formattedRolesApplications.sort((a, b) => a.roleCode.localeCompare(b.roleCode))) !==
        JSON.stringify(formattedExistingRoles.sort((a, b) => a.roleCode.localeCompare(b.roleCode)));
  
  
        let isSaved=false;
        if (hasFieldChanges) {
          console.log('*****hasFieldChanges is true');
          await dispatch(updateUser(updatedFields)).unwrap();
          isSaved=true;
        }
        if (hasRoleChanges) {
          console.log('*****hasRoleChanges is true');
          await dispatch(
            setRoleApplications({
              userId: userInfo.id,
              newUserRolesApplications: formattedRolesApplications,
            })
          ).unwrap();
          isSaved=true;
        }
        if (isSaved){
          dispatch(
            setPopupInfo({
              popupType: "toast", // 设置为 toast 类型
              variant: "success", // 设置为成功消息
              title: "成功",
              content: "入力した情報が保存されました。",
            })
          );

        }        
        return true;
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
console.log('*companyMembers=',companyMembers);
console.log('fields',fields);


//以下代码用来测试多选弹出窗口
// const generateTestData = (data, times) => {
//   const testData = [];
//   for (let i = 0; i < times; i++) {
//     data.forEach((item) => {
//       testData.push({
//         ...item,
//         id: `${item.id}-${i}`, // 确保 ID 唯一
//         name: `${item.name} - ${i}`, // 加入一个编号
//       });
//     });
//   }
//   return testData;
// };
// const testcompanyMembers = generateTestData(companyMembers, 100);

return (
  <Box sx={{ 
    padding: 0,
    // backgroundColor: 'blue',
     }}>
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



    <Grid container spacing={3}>
      <Grid  size={6}>
        <TextField
          label="姓"
          variant="outlined"
          fullWidth
          required
          error={errors.lastName}
          value={fields.lastName}
          onChange={(e) => handleFieldChange('lastName', e.target.value)}
          size="small" 
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
      <Grid  size={6}>
        <TextField
          label="名"
          variant="outlined"
          fullWidth
          required
          error={errors.firstName}
          value={fields.firstName}
          onChange={(e) => handleFieldChange('firstName', e.target.value)}
          size="small" 
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
      <Grid  size={6}>
        <TextField
          label="姓カナ"
          variant="outlined"
          fullWidth
          error={errors.lastNameKana}
          value={fields.lastNameKana}
          onChange={(e) => handleFieldChange('lastNameKana', e.target.value)}
          helperText={errors.lastNameKana && '姓カナは片仮名で入力してください (例: タナカ)'}
          size="small" 
        />
      </Grid>
      <Grid  size={6}>
        <TextField
          label="名カナ"
          variant="outlined"
          fullWidth
          error={errors.firstNameKana}
          value={fields.firstNameKana}
          onChange={(e) => handleFieldChange('firstNameKana', e.target.value)}          
          size="small" 
        />
      </Grid>
      <Grid  size={6}>
        <TextField
          label="メール"
          variant="outlined"
          fullWidth
          value={fields.email}
          size="small" 
        />
      </Grid>
      <Grid  size={6}>
        <TextField
          label="電話番号"
          variant="outlined"
          fullWidth
          required
          error={errors.phoneNumber}
          value={fields.phoneNumber}
          onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}          
          size="small" 
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
      <Grid  size={6}>
        <TextField
          label="部署"
          variant="outlined"
          fullWidth
          value={fields.department}
          onChange={(e) => handleFieldChange('department', e.target.value)}
          size="small" 
        />
      </Grid>
      <Grid size={6}>
      <SearchSelectComponent
            selecteditemid={fields.managerId}
            textDisplayField={['firstName', 'lastName']}
            tableTitle={tableDisplayFormat}
            searchColum="お名前"
            sourcelist={companyMembers || []}
            onSelect={handleSelect}
            onClear={handleClearManager}
            title='マネージャー'
          />

      </Grid>
      <Grid  size={12}>
      <Autocomplete
        multiple
        options={availableRoles}
        getOptionLabel={(option) => option.label}
        value={selectedRoles}
        required
        onChange={handleRoleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="ロール*"
            placeholder="選択してください"
            variant="outlined"
            fullWidth
          />
        )}
        sx={{
          '& .MuiAutocomplete-tag': {
            margin: 0.5, // 标签间距
          },
          '& .MuiInputBase-root': {
            display: 'flex', // 使用 flex 布局
            flexWrap: 'wrap', // 自动换行
            alignItems: 'flex-start', // 标签垂直顶部对齐
            gap: '4px', // 标签之间的间隙
            minHeight: '40px', // 设置最小高度
          },
        }}
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
        
export default PersonalInfoStep;
        