import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import styles from './PersonalInfoStep.module.css';
import SearchSelectComponent from '../SearchSelectComponent/SearchSelectComponent';
import { updateUser, setRoleApplications } from '../../redux/user/userSlice';
const PersonalInfoStep = forwardRef((props, ref) => {
  const dispatch = useDispatch();

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
  const [errorMessage, setErrorMessage] = useState(''); // 错误信息
  

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
        managerId: managerInfo?.id || '',
      });
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
    }
  }, [userInfo, managerInfo, roleMaster, roleApplications]);

  // --- 字段修改处理 ---
  const handleFieldChange = (field, value) => {
    setFields((prevFields) => ({ ...prevFields, [field]: value }));
  };

  const handleSelect = (selected) => {
    console.log('**handleSelect Selected item:', selected);
    setFields((prevFields) => ({
      ...prevFields,
      managerId: selected.key, // 更新选中的 Manager ID
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
  const managerTitle = ['姓名', 'メール', '部署'];
  const formattedCompanyMembers = companyMembers.map((member) => ({
    key: member.id,
    value: [
      `${member.firstName} ${member.lastName}`, // 第一列，显示姓名
      member.email, // 第二列，显示邮箱
      member.department, // 第三列，显示部门
    ],
  }));
  console.log('***formattedCompanyMembers',formattedCompanyMembers);

  // --- 校验逻辑 ---
  const validateFields = () => {
    const errors = {};
    let errorMessage = '';

    // 至少选择一个角色
    if (selectedRoles.length === 0) {
      errors.selectedRoles = true;
      errorMessage = '少なくとも1つのロールを選択してください。';
    }

    
    if (!fields.phoneNumber) {
      errors.phoneNumber = true;
      errorMessage = '電話番号を入力してください。';
    } else if (!/^\d{2,3}-\d{4}-\d{4}$/.test(fields.phoneNumber)) {
      errors.phoneNumber = true;
      errorMessage = '電話番号の形式が正しくありません (例: 090-0000-0000)。';
    }

    // 如果输入了名片假名，则检查是否为片假名
    if (fields.firstNameKana && !/^[\u30A0-\u30FF]+$/.test(fields.firstNameKana)) {
      errors.firstNameKana = true;
      errorMessage = '名カナは片仮名で入力してください。';
    }

    // 如果输入了姓片假名，则检查是否为片假名
    if (fields.lastNameKana && !/^[\u30A0-\u30FF]+$/.test(fields.lastNameKana)) {
      errors.lastNameKana = true;
      errorMessage = '姓カナは片仮名で入力してください。';
    }

    if (!fields.firstName) {
      errors.firstName = true;
      errorMessage = '名を入力してください。';
    }

    // 必填校验
    if (!fields.lastName) {
      errors.lastName = true;
      errorMessage = '姓を入力してください。';
    }

    setErrors(errors);
    setErrorMessage(errorMessage);
    return Object.keys(errors).length === 0;
  };

  // --- 保存方法 ---
  const saveChanges = async () => {
    setErrorMessage('');

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


    try {
      if (hasFieldChanges) {
        console.log('*****hasFieldChanges is true');
        await dispatch(updateUser(updatedFields)).unwrap();
      }
      if (hasRoleChanges) {
        console.log('*****hasRoleChanges is true');
        await dispatch(
          setRoleApplications({
            userId: userInfo.id,
            newUserRolesApplications: formattedRolesApplications,
          })
        ).unwrap();
      }
      console.log('Save successful.');
      return true;
    } catch (error) {
      // 捕获错误并显示
      setErrorMessage(`保存中にエラーが発生しました: ${error}`);
      console.error('Error saving changes:', error);
      return false;
    }
  };


  useImperativeHandle(ref, () => ({
    saveChanges,
  }));

  return (
    <div className={styles.personalInfoStep}>
      {/* 错误消息显示区域 */}
      <div className={styles.personalErrorMessage}>
        {errorMessage && <span>{errorMessage}</span>}
      </div>
  
      {/* 姓名入力行 */}
      <div className={styles.personalFormRow}>
        <div className={styles.personalFormGroup}>
          <label htmlFor="last-name" className={styles.personalLabel}>
            <span style={{ color: 'red' }}>*</span> 姓:
          </label>
          <input
            type="text"
            id="last-name"
            className={`${styles.personalFormInput} ${
              errors.lastName ? styles.errorInput : ''
            }`}
            value={fields.lastName || ''}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            placeholder="姓を入力してください (例: 田中)"
            maxLength={40} // 最大40文字
          />
        </div>
        <div className={styles.personalFormGroup}>
          <label htmlFor="first-name" className={styles.personalLabel}>
            <span style={{ color: 'red' }}>*</span> 名:
          </label>
          <input
            type="text"
            id="first-name"
            className={`${styles.personalFormInput} ${
              errors.firstName ? styles.errorInput : ''
            }`}
            value={fields.firstName || ''}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            placeholder="名を入力してください (例: 太郎)"
            maxLength={40} // 最大40文字
          />
        </div>
      </div>
  
      {/* 姓名カナ入力行 */}
      <div className={styles.personalFormRow}>
        <div className={styles.personalFormGroup}>
          <label htmlFor="last-kana" className={styles.personalLabel}>姓カナ:</label>
          <input
            type="text"
            id="last-kana"
            className={`${styles.personalFormInput} ${
              errors.lastNameKana ? styles.errorInput : ''
            }`}
            value={fields.lastNameKana || ''}
            onChange={(e) => handleFieldChange('lastNameKana', e.target.value)}
            placeholder="姓カナを入力してください (例: タナカ)"
            maxLength={40} // 最大40文字
          />
        </div>
        <div className={styles.personalFormGroup}>
          <label htmlFor="first-kana" className={styles.personalLabel}>名カナ:</label>
          <input
            type="text"
            id="first-kana"
            className={`${styles.personalFormInput} ${
              errors.firstNameKana ? styles.errorInput : ''
            }`}
            value={fields.firstNameKana || ''}
            onChange={(e) => handleFieldChange('firstNameKana', e.target.value)}
            placeholder="名カナを入力してください (例: タロウ)"
            maxLength={40} // 最大40文字
          />
        </div>
      </div>
  
      {/* メールと電話入力行 */}
      <div className={styles.personalFormRow}>
        <div className={styles.personalFormGroup}>
          <label htmlFor="email" className={styles.personalLabel}>メール:</label>
          <input
            type="email"
            id="email"
            className={`${styles.personalFormInput} ${styles.readOnlyInput}`} // 添加只读样式
            value={fields.email || ''}
            readOnly // 読み取り専用
          />
        </div>
        <div className={styles.personalFormGroup}>
          <label htmlFor="phoneNumber" className={styles.personalLabel}>
            <span style={{ color: 'red' }}>*</span> 電話:
          </label>
          <input
            type="tel"
            id="phoneNumber"
            className={`${styles.personalFormInput} ${
              errors.phoneNumber ? styles.errorInput : ''
            }`}
            value={fields.phoneNumber || ''}
            onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
            placeholder="電話番号を入力してください (例: 090-0000-1111)"
            maxLength={13} // 最大13文字
          />
        </div>
      </div>
  
      {/* 部署とマネージャー選択行 */}
      <div className={styles.personalFormRow}>
        <div className={styles.personalFormGroup}>
          <label htmlFor="department" className={styles.personalLabel}>部署:</label>
          <input
            type="text"
            id="department"
            className={styles.personalFormInput}
            value={fields.department || ''}
            onChange={(e) => handleFieldChange('department', e.target.value)}
            placeholder="部署を入力してください (例: 営業部)"
            maxLength={40} // 最大40文字
          />
        </div>
        <div className={styles.personalFormGroup}>
          <label htmlFor="manager" className={styles.personalLabel}>マネージャー:</label>
          <SearchSelectComponent
            selecteditem={
              managerInfo
                ? {
                    key: managerInfo.id,
                    value: [
                      `${managerInfo.firstName} ${managerInfo.lastName}`,
                      managerInfo.email,
                      managerInfo.department,
                    ],
                  }
                : null
            }
            title={managerTitle}
            sourcelist={formattedCompanyMembers || []}
            onSelect={handleSelect}
          />
        </div>
      </div>
  
      {/* ロール選択 */}
      <div className={styles.personalFormGroup}>
        <label htmlFor="role" className={styles.personalLabel}>
          <span style={{ color: 'red' }}>*</span> ロール:
        </label>
        <Autocomplete
          multiple
          options={availableRoles}
          getOptionLabel={(option) => option.label}
          value={selectedRoles}
          onChange={handleRoleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="選択してください"
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.85rem' },
                '& .MuiFormLabel-root': { fontSize: '0.85rem' },
              }}
            />
          )}
          sx={{
            '& .MuiAutocomplete-tag': { fontSize: '0.85rem' },
            '& .MuiAutocomplete-option': { fontSize: '0.85rem' },
          }}
        />
      </div>
    </div>
  );
  
  
    
});

export default PersonalInfoStep;
