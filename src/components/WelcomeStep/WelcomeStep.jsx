import React, { useState, useEffect } from 'react';
import SearchSelectComponent from '../SearchSelectComponent/SearchSelectComponent';
import Toast from '../Common/Toast/Toast';
import AlertModal from '../Common/AlertModal/AlertModal';
import { useDispatch } from "react-redux";
import { setPopupInfo } from "../../redux/popupInfoSlice/popupInfoSlice";

const WelcomeStep = () => {
  const [managerId, setManagerId] = useState(null); // 用于存储选中的 Manager ID
  const [companyMembers, setCompanyMembers] = useState([]); // 用于存储公司成员数据
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
   // グローバル関数
   window.handleConfirm = () => {
    console.log("確認ボタンがクリックされました！");
  };

  window.handleCancel = () => {
    console.log("キャンセルボタンがクリックされました！");
  };

  const showToast = () => {
    dispatch(
      setPopupInfo({
        popupType: "toast",
        variant: "success",
        content: "操作が成功しました！",
      })
    );
  };

  const showAlert = () => {
    dispatch(
      setPopupInfo({
        popupType: "alert",
        variant: "warn",
        title: "警告",
        content: "本当にこの操作を実行しますか？",
        confirmButtonLabel: "確認",
        confirmFunctionName: "handleConfirm",
        cancelButtonLabel: "キャンセル",
        cancelFunctionName: "handleCancel",
      })
    );
  };
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
  const handleConfirm = () => {
    console.log('用户点击了确定');
    setOpen(false);
  };

  const handleCancel = () => {
    console.log('用户点击了取消');
    setOpen(false);
  };

  return (
    <div>
      <h2>ようこそ</h2>
      <button onClick={showToast}>Toast 通知を表示</button>
      <button onClick={showAlert}>Alert 通知を表示</button>

      {/* <button onClick={() => setOpen(true)}>Show Toast</button>
      <Toast
        open={open}
        message="这是一个通知消息！"
        severity="error"
        onClose={() => setOpen(false)}
      /> */}

<button onClick={() => setOpen(true)}>显示警告</button>
      <AlertModal
        open={open}
        title="删除确认"
        message="确定要删除此项吗？此操作无法撤销！"
        severity="warning"
        confirmText="删除"
        cancelText="取消"
        showCancel={true}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />


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
