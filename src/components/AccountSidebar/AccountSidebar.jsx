import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useNavigate } from 'react-router-dom';

const ACCOUNT_MENU_ITEMS = [
  {
    id: 'plan',
    label: 'プラン',
    children: [
      { id: 'plan-current', label: '契約中のプラン' },
      { id: 'plan-history', label: 'プラン履歴' },
      { id: 'plan-select', label: '選べるプラン' },
    ],
  },
  {
    id: 'orders',
    label: '注文',
    children: [{ id: 'orders-list', label: '注文一覧' }],
  },
  {
    id: 'invoices',
    label: '請求',
    children: [{ id: 'invoices-list', label: '請求一覧' }],
  },
  {
    id: 'payments',
    label: '決済',
    children: [
      { id: 'payments-settings', label: '決済設定' },
      { id: 'payments-pending', label: '支払待' },
      { id: 'payments-history', label: '決済履歴' },
    ],
  },
];

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.grey[800],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.9rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0, 1.2),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    }),
    ...theme.applyStyles('dark', {
      color: theme.palette.primary.contrastText,
    }),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

const AccountSidebar = () => {
  const navigate = useNavigate();
  const [lastSelectedItem, setLastSelectedItem] = useState(null);

  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    if (isSelected) {
      setLastSelectedItem(itemId);
      // Navigate to the corresponding path based on the selected item ID
      if (itemId) {
        const path = `/main/account/${itemId.replace(/-/g, '/')}`;
        navigate(path);
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100%', minWidth: 250 }}>
      <RichTreeView
        defaultExpandedItems={['plan', 'orders', 'invoices', 'payments']} // 默认展开所有
        slots={{ item: CustomTreeItem }} // 使用自定义样式
        items={ACCOUNT_MENU_ITEMS} // 菜单数据
        onItemSelectionToggle={handleItemSelectionToggle} // 处理点击事件
      />
    </Box>
  );
};

export default AccountSidebar;
