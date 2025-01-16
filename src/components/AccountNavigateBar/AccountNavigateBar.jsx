import React from 'react';
import { Breadcrumbs, Typography, Link, Box } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const AccountNavigateBar = () => {
  // 定义路径与名称的映射
  const navigationPaths = [
    { path: '/main/account/plan', label: 'プラン' },
    { path: '/main/account/plan/current', label: '契約中のプラン' },
    { path: '/main/account/plan/history', label: 'プラン履歴' },
    { path: '/main/account/plan/select', label: '選べるプラン' },
    { path: '/main/account/plan/select/detail', label: 'プラン詳細情報' },
    { path: '/main/account/orders', label: '注文' },
    { path: '/main/account/orders/list', label: '注文一覧' },
    { path: '/main/account/invoices', label: '請求書' },
    { path: '/main/account/invoices/list', label: '請求一覧' },
    { path: '/main/account/payments', label: '決済' },
    { path: '/main/account/payments/settings', label: '決済設定' },
    { path: '/main/account/payments/pending', label: '支払待' },
    { path: '/main/account/payments/history', label: '決済履歴' },
  ];

  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const generateBreadcrumbs = () => {
    const breadcrumbs = [];
    const addedPaths = new Set(); // 用于去重的集合
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      const matchingPath = navigationPaths.find((item) => item.path === currentPath);

      // 避免重复添加路径
      if (matchingPath && !addedPaths.has(matchingPath.path)) {
        breadcrumbs.push({
          path: matchingPath.path,
          label: matchingPath.label,
        });
        addedPaths.add(matchingPath.path); // 标记路径为已添加
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box
      sx={{
        padding: '4px 16px',

        backgroundColor: '#003366', // 蓝色背景
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        separator=">"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: '#ffffff', // 分隔符颜色为白色
            fontSize: '1rem',
          },
        }}
      >
        {breadcrumbs.map((crumb, index) => (
          index < breadcrumbs.length - 1 ? (
            <Link
              key={crumb.path}
              underline="hover"
              color="inherit"
              component={RouterLink}
              to={crumb.path}
              sx={{
                fontSize: '0.9rem',
                color: '#E0E8F9', // 链接字体颜色为白色
                fontWeight: 500,
                '&:hover': {
                  color: '#d9e8f5', // 悬停时颜色为浅蓝
                  textDecoration: 'underline',
                },
              }}
            >
              {crumb.label}
            </Link>
          ) : (
            <Typography
              key={crumb.path}
              color="textPrimary"
              sx={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#E0E8F9', // 当前页字体颜色为白色
              }}
            >
              {crumb.label}
            </Typography>
          )
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default AccountNavigateBar;
