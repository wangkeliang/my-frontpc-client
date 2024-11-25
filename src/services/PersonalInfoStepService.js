import store from '../redux/store';
import { updateUserRoles, updateUserInfo, updateUser, setUserRoles } from '../redux/user/userSlice';

// 获取角色选项
export const roleOptions = () => {
  const { roleMaster } = store.getState().master;
  if (!roleMaster || !Array.isArray(roleMaster)) return [];
  return roleMaster.map((role) => ({
    label: role.roleName,
    value: role.roleCode,
  }));
};

// 获取搜索选择组件的数据
export const getSearchSelectData = () => {
  const { managerInfo } = store.getState().user;
  const { companyMembers } = store.getState().company;

  const selecteditem = managerInfo
    ? {
        key: managerInfo.id,
        value: [
          managerInfo.firstName + managerInfo.lastName,
          managerInfo.email,
          managerInfo.department,
        ],
      }
    : { key: '', value: [] };

  const title = ['姓名', '邮件', '部门'];

  const sourcelist = companyMembers.map((member) => ({
    key: member.id,
    value: [member.firstName + member.lastName, member.email, member.department],
  }));

  return { selecteditem, title, sourcelist };
};

// Hook: 处理选中的角色
export const usePersonalInfoStep = () => {
  const selectedRoles = store.getState().user.userRoles || [];

  const handleRoleChange = (event, newValue) => {
    const roles = newValue.map((role) => role.value);
    // 更新 Redux store
    store.dispatch(updateUserRoles(roles));
  };

  return { selectedRoles, handleRoleChange };
};

// Hook: 获取用户信息并管理字段值
export const usePersonalInfoFields = () => {
  const fields = store.getState().user.userInfo || {};

  const handleFieldChange = (fieldName, value) => {
    // 更新 Redux store
    store.dispatch(updateUserInfo({ [fieldName]: value }));
  };

  return { fields, handleFieldChange };
};

// 保存用户个人信息和角色信息
export const savePersonalInfo = async () => {
  const { userInfo, userRoles } = store.getState().user;

  // 提取角色代码
  const updatedRoles = userRoles.map((role) => role.roleCode);

  // 过滤掉为空的字段
  const nonEmptyFields = Object.keys(userInfo).reduce((acc, key) => {
    if (userInfo[key] !== null && userInfo[key] !== undefined && userInfo[key] !== '') {
      acc[key] = userInfo[key];
    }
    return acc;
  }, {});

  try {
    // 保存用户信息
    await store.dispatch(updateUser({ userId: userInfo.id, ...nonEmptyFields })).unwrap();
    console.log('用户信息已保存:', nonEmptyFields);

    // 保存用户角色
    await store.dispatch(setUserRoles({ userId: userInfo.id, roles: updatedRoles })).unwrap();
    console.log('用户角色已保存:', updatedRoles);
  } catch (error) {
    console.error('保存个人信息时发生错误:', error);
  }
};
