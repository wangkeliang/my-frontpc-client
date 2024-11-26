import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import styles from './ApplicationInfoStep.module.css';
import { addApplication } from '../../redux/application/applicationSlice';

const ApplicationStep = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const companyAdmins = useSelector((state) => state.company.companyAdmins || []);
  const userId = useSelector((state) => state.auth?.userId || null);
  const userInfo = useSelector((state) => state.user?.userInfo);
  const [selectedAdmin, setSelectedAdmin] = useState(null); // 选中的管理员
  const [errorMessage, setErrorMessage] = useState(''); // 错误信息

  // 初始化加载公司管理员信息
  useEffect(() => {
    if (companyAdmins.length === 1) {
      setSelectedAdmin(companyAdmins[0]); // 如果只有一个管理员，自动选中
    }
  }, [companyAdmins]);

  // 保存申请信息
  const saveApplication = async () => {
    setErrorMessage('');

    if (!selectedAdmin) {
      setErrorMessage('承認する管理者を選択してください。');
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

    try {
      await dispatch(addApplication(applicationData)).unwrap();
      return true;
    } catch (error) {
      setErrorMessage(`申請の保存中にエラーが発生しました: ${error}`);
      console.error('Error saving application:', error);
      return false;
    }
  };

  // 暴露保存方法
  useImperativeHandle(ref, () => ({
    saveApplication,
  }));

  return (
    <div className={styles.applicationStep}>
      <p>あなたのアカウントは貴社のシステム管理者の承認が必要です。</p>
      <p>承認者を選択してください。</p>

      {/* 错误信息显示 */}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

      {/* 系统管理员选择下拉列表 */}
      <div className={styles.autocompleteContainer}>
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
            '& .MuiInputBase-root': { fontSize: '0.85rem' },
            '& .MuiFormLabel-root': { fontSize: '0.85rem' },
          }}
        />
      </div>
    </div>
  );
});

export default ApplicationStep;
