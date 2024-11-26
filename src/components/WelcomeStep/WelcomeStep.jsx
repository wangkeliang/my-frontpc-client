import React, { useState, useEffect } from 'react';
import SearchSelectComponent from '../SearchSelectComponent/SearchSelectComponent';

const WelcomeStep = () => {
  const [managerId, setManagerId] = useState(null); // 用于存储选中的 Manager ID
  const [companyMembers, setCompanyMembers] = useState([]); // 用于存储公司成员数据

  // 模拟从 API 获取初始数据
  useEffect(() => {
    const fetchData = async () => {
      // 模拟异步获取数据
      const mockCompanyMembers = [
        { id: '123', firstName: '田中', lastName: '太郎', email: 'tanaka@example.com', department: '営業' },
        { id: '456', firstName: '鈴木', lastName: '花子', email: 'suzuki@example.com', department: '開発' },
        { id: '1', firstName: '鈴木1', lastName: '花子', email: 'suzuki@example.com', department: '開発' },
        { id: '2', firstName: '鈴木2', lastName: '花子', email: 'suzuki@example.com', department: '開発' },
        { id: '3', firstName: '鈴木3', lastName: '花子', email: 'suzuki@example.com', department: '開発' },
        { id: '4', firstName: '鈴木4', lastName: '花子', email: 'suzuki@example.com', department: '開発' },
        { id: '5', firstName: '鈴木5', lastName: '花子', email: 'suzuki@example.com', department: '開発' },
        { id: '6', firstName: '鈴木6', lastName: '花子', email: 'suzuki@example.com', department: '開発' },
      ];

      setCompanyMembers(mockCompanyMembers); // 设置公司成员数据
      setManagerId('123'); // 默认选中 ID 为 '123'
    };

    fetchData();
  }, []);

  // 处理选中项更新的回调
  const handleSelect = (selectedItem) => {
    console.log('Selected Item:', selectedItem);
    setManagerId(selectedItem.id); // 更新选中的 Manager ID
  };

  return (
    <div>
      <h2>ようこそ</h2>
      <div style={{ marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          マネージャーを選択してください:
        </label>
        <SearchSelectComponent
          selecteditemid={managerId} // 当前选中的 Manager ID
          textDisplayField={['firstName', 'lastName']} // 在输入框中显示的字段
          tableTitle={{
            お名前: ['firstName', 'lastName'],
            メール: ['email'],
            部署: ['department'],
          }} // 表头和对应字段映射
          searchColum="お名前" // 搜索列名，匹配指定列
          sourcelist={companyMembers} // 数据源
          onSelect={handleSelect} // 选中后的回调函数
        />
      </div>
    </div>
  );
};

export default WelcomeStep;
